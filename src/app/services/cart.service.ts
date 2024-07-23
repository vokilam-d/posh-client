import { computed, effect, EventEmitter, Injectable, signal } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { ICartItem, ISelectedOption } from '../interfaces/cart-item.interface';
import { ICart } from '../interfaces/cart.interface';
import { PaymentType } from '../enums/payment-type.enum';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private persistedCartKey = `pos-cart`;

  private _cart = signal<ICart>(this.buildEmptyCart());
  paymentType = computed(() => this._cart().paymentType)
  cartItems = computed(() => this._cart().items)
  totalCost = computed(() => this.cartItems().reduce((acc, item) => acc + this.calcItemCost(item), 0));

  buy$ = new EventEmitter<void>();

  constructor() {
    const persistedCart = this.getPersistedCart();
    this._cart.set(persistedCart);

    effect(() => this.persistCart(this._cart()));
  }

  addToCart(product: IProduct, selectedOptions: ISelectedOption[] = []): void {
    this._cart.update(cart => {
      cart = structuredClone(cart);

      const existingCartItem = cart.items.find(cartItem => {
        return cartItem.productId === product.id
          && this.isSelectedOptionsSame(cartItem.selectedOptions, selectedOptions);
      });
      if (existingCartItem) {
        existingCartItem.qty += 1;
      } else {
        cart.items.push({
          productId: product.id,
          productName: product.name,
          qty: 1,
          price: product.price as number,
          selectedOptions: selectedOptions,
        });
      }

      return cart;
    });
  }

  removeFromCart(cartItemIndex: number): void {
    this._cart.update(cart => {
      cart = structuredClone(cart);

      cart.items.splice(cartItemIndex, 1);
      return cart;
    });
  }

  incrementQty(cartItemIndex: number): void {
    this._cart.update(cart => {
      cart = structuredClone(cart);

      const existingCartItem = cart.items[cartItemIndex];
      if (existingCartItem) {
        existingCartItem.qty += 1;
      }

      return cart;
    });
  }

  decrementQty(cartItemIndex: number): void {
    this._cart.update(cart => {
      cart = structuredClone(cart);

      const existingCartItem = cart.items[cartItemIndex];
      if (existingCartItem) {
        existingCartItem.qty -= 1;
      }

      if (existingCartItem.qty <= 0) {
        cart.items.splice(cartItemIndex, 1);
      }

      return cart;
    });
  }

  onQtyManualChange(): void {
    this._cart.update(cart => structuredClone(cart));
  }

  calcItemPrice(cartItem: ICartItem): number {
    const optionsPriceDiff = cartItem.selectedOptions.reduce((acc, option) => acc + option.priceDiff, 0);

    return cartItem.price + optionsPriceDiff;
  }

  calcItemCost(cartItem: ICartItem): number {
    return this.calcItemPrice(cartItem) * cartItem.qty;
  }

  setPaymentType(paymentType: PaymentType): void {
    this._cart.update(cart => {
      cart = structuredClone(cart);
      cart.paymentType = paymentType;
      return cart;
    });
  }

  buy(): void {
    this.buy$.next();
    this._cart.set(this.buildEmptyCart());
  }

  private persistCart(cart: ICart): void {
    localStorage.setItem(this.persistedCartKey, JSON.stringify(cart));
  }

  private getPersistedCart(): ICart {
    const persistedCart = localStorage.getItem(this.persistedCartKey);
    return persistedCart ? JSON.parse(persistedCart) : this.buildEmptyCart();
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

  private buildEmptyCart(): ICart {
    return {
      paymentType: null,
      items: [],
    };
  }
}
