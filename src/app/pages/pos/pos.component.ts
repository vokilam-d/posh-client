import { Component, inject } from '@angular/core';
import { CategoryComponent } from '../../components/category/category.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartComponent } from '../../components/cart/cart.component';
import { CartService } from '../../services/cart.service';
import { DatePipe } from '@angular/common';
import { ICart } from '../../interfaces/cart.interface';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CategoryComponent,
    RouterOutlet,
    CartComponent,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent {

  readonly cartService = inject(CartService);

  constructor() {
  }

  deleteCart(cart: ICart, cartIndex: number): void {
    if (cart.items.length && !confirm('В замовленні є товари, все одно видалити?')) {
      return;
    }

    this.cartService.deleteCart(cartIndex);
  }
}
