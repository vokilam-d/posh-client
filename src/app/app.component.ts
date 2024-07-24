import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private productsService = inject(ProductService);
  private categoryService = inject(CategoryService);

  constructor() {
    this.productsService.fetchProducts();
    this.categoryService.fetchCategories();
  }
}
