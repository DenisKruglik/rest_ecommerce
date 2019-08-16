from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Category, Product, CartInventory, Cart, OrderInventory, Order
from rest_framework_jwt.settings import api_settings


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups']


class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = ['url', 'id', 'sku', 'name', 'price', 'description', 'categories']


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
