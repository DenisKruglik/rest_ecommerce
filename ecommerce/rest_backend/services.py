from .models import Cart, CartInventory, Order, OrderInventory


class CartService:
    @staticmethod
    def get_cart(user):
        try:
            cart = Cart.objects.get(owner=user)
        except Cart.DoesNotExist:
            cart = Cart.objects.create(owner=user)
        return cart

    @staticmethod
    def add_to_cart(user, item):
        cart = CartService.get_cart(user)
        return cart.add_item(item)

    @staticmethod
    def purchase(user):
        cart = CartService.get_cart(user)
        items = cart.items.all()
        if items:
            order = Order(customer=cart.owner)
            order.save()

            for item in items:
                order_item = OrderInventory(
                    product=item.product,
                    qty=item.qty,
                    order=order
                )
                order_item.save()

            cart.items.all().delete()
            return order
        else:
            raise CartService.EmptyCart

    class EmptyCart(Exception):
        pass
