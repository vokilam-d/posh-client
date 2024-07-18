import { Component, computed, effect, inject, input } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    ProductComponent,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

  categoryId = input<string | null>(null);

  products = computed(() => {
    const categoryId = this.categoryId();
    return this.productsService.products().filter(product => {
      if (!categoryId) {
        return !product.parentCategoryId;
      } else {
        return product.parentCategoryId === categoryId;
      }
    })
  });

  private productsService = inject(ProductsService);

  constructor() {
    effect(() => {
      console.log(this.categoryId());
    });
  }
}
