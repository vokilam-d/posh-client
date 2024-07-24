import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  navbarItems: { route: string; iconName: string }[] = [
    { route: 'pos', iconName: 'home' },
    { route: 'category', iconName: 'table_chart' },
    { route: 'product', iconName: 'coffee' },
    { route: 'product-options', iconName: 'tune' },
  ];

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  constructor() {
    this.productService.fetchProducts();
    this.categoryService.fetchCategories();
  }
}
