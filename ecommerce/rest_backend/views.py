from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from .serializers import UserSerializer, GroupSerializer, CategorySerializer, CategoryWithProductsSerializer, \
    ProductSerializer, CartSerializer, CartInventorySerializer, OrderSerializer
from .models import Category, Product, CartInventory, Order
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework import mixins
from rest_framework import generics
from .permissions import IsOwnerOrAdmin, IsAdminOrReadOnly
from .services import CartService


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    permission_classes = [permissions.IsAdminUser]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Category.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return CategorySerializer
        return CategoryWithProductsSerializer


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = CartService.get_cart(request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)


class AddToCart(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CartInventorySerializer(data=request.data)
        if serializer.is_valid():
            item = CartInventory(**serializer.validated_data)
            inventory = CartService.add_to_cart(request.user, item)
            serializer = CartInventorySerializer(inventory, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CartItemUpdateDelete(mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartInventorySerializer

    def get_queryset(self):
        return CartInventory.objects.filter(cart=CartService.get_cart(self.request.user))

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class Purchase(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            order = CartService.purchase(request.user)
        except CartService.EmptyCart:
            return Response({'message': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = OrderSerializer(order, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        else:
            return Order.objects.filter(customer=self.request.user)


class OrderDetails(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
