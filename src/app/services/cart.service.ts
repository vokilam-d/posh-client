import { computed, Injectable, signal } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { ICartItem } from '../interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _cartItems = signal<ICartItem[]>([], { equal: (a, b) => this.getTotalCost(a) === this.getTotalCost(b) });
  cartItems = this._cartItems.asReadonly();
  totalCost = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.qty), 0));

  constructor() { }

  addToCart(product: IProduct): void {
    if (product.isCategory) {
      console.error(`Category cannot be added to cart`);
    }

    this._cartItems.update(cartItems => {
      cartItems = structuredClone(cartItems);

      const existingCartItem = cartItems.find(cartItem => cartItem.productId === product.id);
      if (existingCartItem) {
        existingCartItem.qty += 1;
      } else {
        cartItems.push({
          productId: product.id,
          productName: product.name,
          qty: 1,
          price: product.price as number,
        });
      }

      return cartItems;
    });
  }

  removeFromCart(cartItemIndex: number): void {
    this._cartItems.update(cartItems => {
      cartItems = structuredClone(cartItems);

      return cartItems.splice(cartItemIndex, 1);
    });
  }

  incrementQty(cartItemIndex: number): void {
    this._cartItems.update(cartItems => {
      cartItems = structuredClone(cartItems);

      const existingCartItem = cartItems[cartItemIndex];
      if (existingCartItem) {
        existingCartItem.qty +=  1;
      }

      return cartItems;
    });
  }

  decrementQty(cartItemIndex: number): void {
    this._cartItems.update(cartItems => {
      cartItems = structuredClone(cartItems);

      const existingCartItem = cartItems[cartItemIndex];
      if (existingCartItem) {
        existingCartItem.qty -=  1;
      }

      if (existingCartItem.qty <= 0) {
        cartItems.splice(cartItemIndex, 1);
      }

      return cartItems;
    });
  }

  private getTotalCost(cartItems: ICartItem[]): number {
    return cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }
}
