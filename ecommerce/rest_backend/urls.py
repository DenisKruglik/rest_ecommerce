from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, GroupViewSet, CategoryViewSet, ProductViewSet, CartView, AddToCart, \
    CartItemUpdateDelete, Purchase, OrderList, OrderDetails

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register('categories', CategoryViewSet)
router.register('products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('cart/', CartView.as_view(), name='cart-detail'),
    path('cart/<int:pk>/', CartItemUpdateDelete.as_view(), name='cart-edit'),
    path('cart/add/', AddToCart.as_view(), name='add-to-cart'),
    path('purchase/', Purchase.as_view(), name='purchase'),
    path('orders/', OrderList.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetails.as_view(), name='order-details')
]
