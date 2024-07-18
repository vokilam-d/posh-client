import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { ProductsService } from './services/products.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CategoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  productsService = inject(ProductsService);

  constructor() {
    this.productsService.fetchProducts();
  }
}
