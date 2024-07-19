import { Component, inject, input } from '@angular/core';
import { IProduct } from '../../interfaces/product.interface';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ImgComponent } from '../img/img.component';

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
  router = inject(Router);
  cartService = inject(CartService);

  onClick() {
      // this.router.navigate(['/', 'pos', 'category', this.product().id]);
    this.cartService.addToCart(this.product());
  }
}
