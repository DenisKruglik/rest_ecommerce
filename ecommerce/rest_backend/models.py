from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class PrintableModel:
    printables = []

    def __str__(self):
        return ', '.join(['%s=%s' % (key, getattr(self, key)) for key in self.printables])


class Category(PrintableModel, models.Model):
    name = models.CharField(max_length=200)
    printables = ['id', 'name']


class Product(PrintableModel, models.Model):
    sku = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    categories = models.ManyToManyField(Category, related_name='products')
    printables = ['id', 'sku', 'name', 'price']


class Cart(PrintableModel, models.Model):
    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='cart'
    )
    printables = ['owner']

    def add_item(self, item):
        try:
            inventory = CartInventory.objects.get(product=item.product, cart=self)
        except CartInventory.DoesNotExist:
            item.cart = self
            inventory = item
        else:
            inventory.qty += item.qty

        inventory.save()
        return inventory


class CartInventory(PrintableModel, models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    printables = ['id', 'product', 'qty', 'cart']


class Order(PrintableModel, models.Model):
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    printables = ['id', 'customer']


class OrderInventory(PrintableModel, models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    printables = ['id', 'product', 'qty', 'order']
