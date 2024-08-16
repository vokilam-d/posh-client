import { Component, computed, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartComponent } from '../../components/cart/cart.component';
import { CartService } from '../../services/cart.service';
import { DatePipe } from '@angular/common';
import { ICart } from '../../interfaces/cart.interface';
import { CategoryTabsComponent } from '../../components/category-tabs/category-tabs.component';
import { ProductService } from '../../services/product.service';
import { ProductComponent } from '../../components/product/product.component';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    RouterOutlet,
    CartComponent,
    DatePipe,
    CategoryTabsComponent,
    ProductComponent,
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent {

  categoryId = input<string | null>(null);
  products = computed(() => {
    const categoryId = this.categoryId();

    return this.productsService.cachedEnabledProducts().filter(product => {
      if (!categoryId) {
        return true;
      }

      return product.categoryId === categoryId;
    });
  });

  readonly cartService = inject(CartService);
  private productsService = inject(ProductService);

  constructor() {
  }

  deleteCart(cart: ICart, cartIndex: number): void {
    if (cart.items.length && !confirm('В замовленні є товари, все одно видалити?')) {
      return;
    }

    this.cartService.deleteCart(cartIndex);
  }
}
