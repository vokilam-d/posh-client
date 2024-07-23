import { Component, computed, inject, input } from '@angular/core';
import { IProduct, IProductOption, IProductOptionValues } from '../../interfaces/product.interface';
import { NgOptimizedImage } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ImgComponent } from '../img/img.component';
import { ISelectedOption } from '../../interfaces/cart-item.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ImgComponent,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  product = input.required<IProduct>();
  hasOptions = computed<boolean>(() => this.product().options.length > 0);
  selectedOptionsMap: Map<string, string> = new Map();

  private cartService = inject(CartService);

  constructor() {
    this.cartService.buy$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.selectedOptionsMap.clear());
  }
  onClick() {
    if (this.hasOptions()) {
      return;
    }

    this.cartService.addToCart(this.product());
  }

  selectOptionValue(option: IProductOption, optionValue: IProductOptionValues): void {
    const isSelected = this.selectedOptionsMap.get(option.id) === optionValue.id;
    isSelected
      ? this.selectedOptionsMap.delete(option.id)
      : this.selectedOptionsMap.set(option.id, optionValue.id);
  }

  addToCart(): void {
    if (!this.isAllOptionsSelected()) {
      return;
    }

    this.cartService.addToCart(this.product(), this.buildSelectedOptions());
  }

  isAllOptionsSelected(): boolean {
    if (!this.hasOptions()) {
      return true;
    }

    return this.selectedOptionsMap.size === this.product().options.length;
  }

  calcPrice(): number {
    return this.product().options.reduce(
      (acc, option) => {
        const selectedValue = option.values.find(value => value.id === this.selectedOptionsMap.get(option.id));
        return acc + (selectedValue?.priceDiff ?? 0);
      },
      this.product().price,
    );
  }

  private buildSelectedOptions(): ISelectedOption[] {
    return this.product().options
      .map(option => {
        const selectedValue = option.values.find(value => value.id === this.selectedOptionsMap.get(option.id));
        return {
          optionId: option.id,
          optionName: option.name,
          optionValueId: selectedValue.id,
          optionValueName: selectedValue.name,
          priceDiff: selectedValue.priceDiff,
        };
      });
  }
}
