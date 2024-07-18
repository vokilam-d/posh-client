import { Component } from '@angular/core';
import { CategoryComponent } from '../../components/category/category.component';
import { RouterOutlet } from '@angular/router';
import { CartComponent } from '../../components/cart/cart.component';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CategoryComponent,
    RouterOutlet,
    CartComponent,
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent {

  constructor() {
  }
}
