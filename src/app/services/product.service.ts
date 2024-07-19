import { Injectable, signal } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products = signal<IProduct[]>([]);

  constructor() { }

  fetchProducts(): void {
    this.products.set([
      {
        id: '1',
        categoryId: '1',
        name: 'Фільтр',
        price: 50,
        photoUrl: null,
      },
      {
        id: '2',
        categoryId: '2',
        name: 'Капуч на звичайном',
        price: 50,
        photoUrl: null,
      },
      {
        id: '3',
        categoryId: '2',
        name: 'Капуч на безлактозном',
        price: 60,
        photoUrl: null,
      },
      {
        id: '4',
        categoryId: '2',
        name: 'Капуч на рослинном',
        price: 70,
        photoUrl: null,
      },
      {
        id: '6',
        categoryId: '4',
        name: 'Печиво з фініком',
        price: 15,
        photoUrl: null,
      },
      {
        id: '7',
        categoryId: '3',
        name: 'Колдбрю',
        price: 35,
        photoUrl: null,
      },
      {
        id: '9',
        categoryId: '5',
        name: 'Тарт з лимоном',
        price: 90,
        photoUrl: null,
      },
      {
        id: '10',
        categoryId: '5',
        name: 'Тарт з лохиною',
        price: 91,
        photoUrl: null,
      },
    ]);
  }

  getProductById(productId: string): IProduct {
    return this.products().find(product => product.id === productId) as IProduct;
  }
}
