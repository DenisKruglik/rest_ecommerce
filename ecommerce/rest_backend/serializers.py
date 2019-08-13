from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Category, Product, CartInventory, Cart, OrderInventory, Order
from django.core.paginator import Paginator


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = ['url', 'id', 'sku', 'name', 'price', 'description', 'categories']


class CategoryWithProductsSerializer(serializers.HyperlinkedModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    # TODO: add pagination for nested products

    class Meta:
        model = Category
        fields = ['url', 'id', 'name', 'products']


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ['url', 'id', 'name']


class CartInventorySerializer(serializers.ModelSerializer):
    qty = serializers.IntegerField(min_value=1)
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CartInventory
        fields = ['id', 'product_id', 'product', 'qty', 'cart']
        extra_kwargs = {'cart': {'required': False}}


class CartSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    items = CartInventorySerializer(many=True)

    class Meta:
        model = Cart
        fields = ['owner', 'items']


class OrderInventorySerializer(serializers.ModelSerializer):
    qty = serializers.IntegerField(min_value=1)
    product = ProductSerializer()

    class Meta:
        model = OrderInventory
        fields = ['id', 'product', 'qty', 'order']


class OrderSerializer(serializers.ModelSerializer):
    customer = serializers.ReadOnlyField(source='owner.username')
    items = OrderInventorySerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'items']
