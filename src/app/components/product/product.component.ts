import { Component, inject, input } from '@angular/core';
import { IProduct } from '../../interfaces/product.interface';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  product = input.required<IProduct>();
  router = inject(Router);
  cartService = inject(CartService);

  onClick() {
    if (this.product().isCategory) {
      this.router.navigate(['/', 'pos', 'category', this.product().id]);
    } else {
      this.cartService.addToCart(this.product());
    }
  }
}
