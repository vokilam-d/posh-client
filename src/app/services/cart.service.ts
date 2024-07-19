import { computed, effect, Injectable, signal } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { ICartItem } from '../interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private persistedCartKey = `cart`;

  private _cartItems = signal<ICartItem[]>([]);
  cartItems = this._cartItems.asReadonly();
  totalCost = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.qty), 0));

  constructor() {
    const persistedCart = this.getPersistedCart();
    this._cartItems.set(persistedCart);

    effect(() => this.persistCart(this.cartItems()));
  }

  addToCart(product: IProduct): void {
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

  private persistCart(cartItems: ICartItem[]): void {
    localStorage.setItem(this.persistedCartKey, JSON.stringify(cartItems));
  }

  private getPersistedCart(): ICartItem[] {
    const persistedCart = localStorage.getItem(this.persistedCartKey);
    return persistedCart ? JSON.parse(persistedCart) : [];
  }
}
