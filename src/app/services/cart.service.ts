import { computed, effect, EventEmitter, Injectable, signal } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { ICartItem, ISelectedOption } from '../interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private persistedCartKey = `cart`;

  private _cartItems = signal<ICartItem[]>([]);
  cartItems = this._cartItems.asReadonly();
  totalCost = computed(() => this.cartItems().reduce((acc, item) => acc + this.calcItemCost(item), 0));

  buy$ = new EventEmitter<void>();

  constructor() {
    const persistedCart = this.getPersistedCart();
    this._cartItems.set(persistedCart);

    effect(() => this.persistCart(this.cartItems()));
  }

  addToCart(product: IProduct, selectedOptions: ISelectedOption[] = []): void {
    this._cartItems.update(cartItems => {
      cartItems = structuredClone(cartItems);

      const existingCartItem = cartItems.find(cartItem => {
        return cartItem.productId === product.id
          && this.isSelectedOptionsSame(cartItem.selectedOptions, selectedOptions);
      });
      if (existingCartItem) {
        existingCartItem.qty += 1;
      } else {
        cartItems.push({
          productId: product.id,
          productName: product.name,
          qty: 1,
          price: product.price as number,
          selectedOptions: selectedOptions,
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
        existingCartItem.qty += 1;
      }

      return cartItems;
    });
  }

  decrementQty(cartItemIndex: number): void {
    this._cartItems.update(cartItems => {
      cartItems = structuredClone(cartItems);

      const existingCartItem = cartItems[cartItemIndex];
      if (existingCartItem) {
        existingCartItem.qty -= 1;
      }

      if (existingCartItem.qty <= 0) {
        cartItems.splice(cartItemIndex, 1);
      }

      return cartItems;
    });
  }

  calcItemPrice(cartItem: ICartItem): number {
    const optionsPriceDiff = cartItem.selectedOptions.reduce((acc, option) => acc + option.priceDiff, 0);

    return cartItem.price + optionsPriceDiff;
  }

  calcItemCost(cartItem: ICartItem): number {
    return this.calcItemPrice(cartItem) * cartItem.qty;
  }

  buy(): void {
    this.buy$.next();
    this._cartItems.set([]);
  }

  private persistCart(cartItems: ICartItem[]): void {
    localStorage.setItem(this.persistedCartKey, JSON.stringify(cartItems));
  }

  private getPersistedCart(): ICartItem[] {
    const persistedCart = localStorage.getItem(this.persistedCartKey);
    return persistedCart ? JSON.parse(persistedCart) : [];
  }

  private isSelectedOptionsSame(selectedOptions1: ISelectedOption[], selectedOptions2: ISelectedOption[]): boolean {
    if (selectedOptions1.length !== selectedOptions2.length) {
      return false;
    }

    return selectedOptions1.every(option1 => {
      return selectedOptions2.find(option2 => {
        return option2.optionId === option1.optionId && option2.optionValueId === option1.optionValueId;
      });
    });
  }
}
