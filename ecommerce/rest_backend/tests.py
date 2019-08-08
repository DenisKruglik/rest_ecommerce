from rest_framework.test import APITestCase
from django.test import TestCase
from django.contrib.auth.models import User
from .services import CartService
from .models import Cart, CartInventory, Product, Category, Order
from django.urls import reverse
from rest_framework import status
from .serializers import UserSerializer, CartSerializer, CartInventorySerializer, ProductSerializer
from collections import OrderedDict
from rest_framework.test import APIRequestFactory


class CartSetupMixin:
    def cart_setUp(self):
        self.user = User.objects.create_user(username='test_user', email='testuser@gmail.com', password='1234567')
        self.category = Category.objects.create(name='Test category')
        self.product = Product.objects.create(
            sku='testproduct',
            name='Test product',
            price=100,
            description='Test product'
        )
        self.product.save()
        self.product.categories.set([self.category])
        self.product.save()


class CartServiceTests(TestCase, CartSetupMixin):
    def setUp(self):
        self.cart_setUp()

    def test_get_cart(self):
        cart = CartService.get_cart(self.user)
        self.assertIsInstance(cart, Cart)
        self.assertEquals(cart.owner, self.user)
        try:
            cart = Cart.objects.get(owner=self.user)
        except Cart.DoesNotExist:
            self.fail('Cart object is missing in db')
        else:
            cart.delete()

    def test_add_to_cart(self):
        item = CartInventory(product=self.product, qty=1)
        cart = Cart.objects.create(owner=self.user)
        CartService.add_to_cart(self.user, item)
        self.assertIn(item, cart.items.all())
        cart.delete()

    def test_purchase(self):
        cart = Cart.objects.create(owner=self.user)
        item = cart.items.create(product=self.product, qty=1, cart=cart)
        order = CartService.purchase(self.user)
        self.assertIsInstance(order, Order)
        self.assertEquals(order.customer, self.user)
        self.assertEquals(len(order.items.all()), 1)
        order_item = order.items.all()[0]
        self.assertEquals(order_item.product, self.product)
        self.assertEquals(order_item.qty, item.qty)
        cart.delete()

    def test_purchase_when_cart_is_empty(self):
        with self.assertRaises(CartService.EmptyCart):
            CartService.purchase(self.user)


class CartTests(TestCase, CartSetupMixin):
    def setUp(self):
        self.cart_setUp()

    def test_add_item(self):
        cart = Cart.objects.create(owner=self.user)
        item = CartInventory(product=self.product, qty=1)
        cart.add_item(item)
        self.assertEquals(len(cart.items.all()), 1)
        self.assertIn(item, cart.items.all())


class UsersViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user', email='testuser@gmail.com', password='1234567')
        self.admin_user = User.objects.create_superuser(username='admin', email='admin@gmail.com', password='1234567')

    def test_get_user_for_regular_user(self):
        self.client.force_login(self.user)
        response = self.client.get('/users/%s/' % self.user.id)
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_users_list_for_regular_user(self):
        self.client.force_login(self.user)
        response = self.client.get(reverse('user-list'))
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_user_for_regular_user(self):
        self.client.force_login(self.user)
        response = self.client.post(reverse('user-list'), data={
            'username': 'test_user2',
            'email': 'testuser2@gmail.com',
            'password': '1234567'
        })
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_change_user_for_regular_user(self):
        self.client.force_login(self.user)
        response = self.client.put('/users/%s/' % self.user.id, data={
            'username': 'test_user2',
            'email': 'testuser2@gmail.com',
            'password': '1234567'
        })
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_user_for_regular_user(self):
        self.client.force_login(self.user)
        response = self.client.delete('/users/%s/' % self.user.id)
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_user_for_admin(self):
        self.client.force_login(self.admin_user)
        response = self.client.get('/users/%s/' % self.user.id)
        serializer = UserSerializer(self.user)
        self.assertEquals(response.data, serializer.data)

    def test_get_users_list_for_admin(self):
        self.client.force_login(self.admin_user)
        response = self.client.get(reverse('user-list'))
        serializer = UserSerializer(User.objects.all(), many=True)
        result = OrderedDict()
        result['count'] = 2
        result['next'] = None
        result['previous'] = None
        result['results'] = serializer.data
        self.assertEquals(response.data, result)

    def test_create_user_for_admin(self):
        self.client.force_login(self.admin_user)
        response = self.client.post(reverse('user-list'), data={
            'username': 'test_user2',
            'email': 'testuser2@gmail.com',
            'password': '1234567'
        })
        try:
            user = User.objects.get(username='test_user2')
        except User.DoesNotExist:
            self.fail('User was not created')
        else:
            serializer = UserSerializer(user)
            self.assertEquals(response.data, serializer.data)
            user.delete()

    def test_change_user_for_admin(self):
        self.client.force_login(self.admin_user)
        response = self.client.put('/users/%s/' % self.user.id, data={
            'username': 'test_user3',
            'email': 'testuser@gmail.com',
            'password': '1234567'
        })
        serializer = UserSerializer(User.objects.get(id=self.user.id))
        self.assertEquals(response.data, serializer.data)

    def test_delete_user_for_admin(self):
        self.client.force_login(self.admin_user)
        user = User.objects.create_user(
            username='test_user4',
            email='testuser4@gmail.com',
            password='1234567'
        )
        response = self.client.delete('/users/%s/' % user.id)
        self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(username='test_user4')


class CartViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user', email='testuser@gmail.com', password='1234567')

    def test_cart_detail_for_non_authenticated_user(self):
        response = self.client.get(reverse('cart-detail'))
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cart_detail(self):
        self.client.force_login(self.user)
        response = self.client.get(reverse('cart-detail'))
        cart = Cart.objects.get(owner=self.user)
        serializer = CartSerializer(cart)
        self.assertEquals(response.data, serializer.data)
        self.client.logout()


class AddToCartTests(APITestCase, CartSetupMixin):
    def setUp(self):
        self.cart_setUp()

    @staticmethod
    def _get_dummy_context():
        return {'request': APIRequestFactory().get('/')}

    def test_add_to_cart(self):
        self.client.force_login(self.user)
        cart = Cart.objects.create(owner=self.user)
        # serializer = ProductSerializer(self.product, context=self._get_dummy_context())
        response = self.client.post(reverse('add-to-cart'), data={
            'product': self.product.id,
            'qty': 1
        })
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        cart = Cart.objects.get(owner=self.user)
        self.assertEquals(len(cart.items.all()), 1)
        item = cart.items.all()[0]
        serializer = CartInventorySerializer(item)
        self.assertEquals(response.data, serializer.data)
        cart.delete()
        self.client.logout()

    def test_add_to_cart_for_non_authenticated_user(self):
        serializer = ProductSerializer(self.product, context=self._get_dummy_context())
        response = self.client.post(reverse('add-to-cart'), data={
            'product': serializer.data['url'],
            'qty': 1
        })
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)
