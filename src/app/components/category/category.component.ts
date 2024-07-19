import { Component, computed, inject, input } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductComponent } from '../product/product.component';
import { CategoryTabsComponent } from '../category-tabs/category-tabs.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    ProductComponent,
    CategoryTabsComponent,
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
        return true;
      } else {
        return product.categoryId === categoryId;
      }
    });
  });

  private productsService = inject(ProductService);

  constructor() { }
}
