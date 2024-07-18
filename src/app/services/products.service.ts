import { Injectable, signal } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products = signal<IProduct[]>([]);

  constructor() { }

  fetchProducts(): void {
    this.products.set([
      {
        id: '1',
        parentCategoryId: null,
        name: 'Капуч',
        price: null,
        isCategory: true,
        photoUrl: null,
      },
      {
        id: '2',
        parentCategoryId: '1',
        name: 'Капуч на звичайном',
        price: 50,
        isCategory: false,
        photoUrl: null,
      },
      {
        id: '3',
        parentCategoryId: '1',
        name: 'Капуч на безлактозном',
        price: 60,
        isCategory: false,
        photoUrl: null,
      },
      {
        id: '4',
        parentCategoryId: '1',
        name: 'Капуч на рослинном',
        price: 70,
        isCategory: false,
        photoUrl: null,
      },
      {
        id: '5',
        parentCategoryId: null,
        name: 'Солодке',
        price: null,
        isCategory: true,
        photoUrl: null,
      },
      {
        id: '6',
        parentCategoryId: '5',
        name: 'Печиво з фініком',
        price: 15,
        isCategory: false,
        photoUrl: null,
      },
      {
        id: '7',
        parentCategoryId: null,
        name: 'Колдбрю',
        price: 35,
        isCategory: false,
        photoUrl: null,
      },
    ]);
  }
}
