import { Injectable, signal } from '@angular/core';
import { IProduct, IProductOption } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products = signal<IProduct[]>([]);

  constructor() {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.products.set([
      {
        id: '1',
        categoryId: '1',
        name: 'Фільтр',
        price: 50,
        photoUrl: null,
        options: [{
          id: '1',
          name: 'Розмір',
          values: [
            { id: '1', name: 'S (150)', priceDiff: 0 },
            { id: '2', name: 'M (250)', priceDiff: 10 },
            { id: '3', name: 'L (350)', priceDiff: 20 },
          ],
        }],
      },
      {
        id: '2',
        categoryId: '2',
        name: 'Капуч',
        price: 50,
        photoUrl: null,
        options: [
          {
            id: '1',
            name: 'Розмір',
            values: [
              { id: '1', name: 'S (150)', priceDiff: 0 },
              { id: '2', name: 'M (250)', priceDiff: 12 },
              { id: '3', name: 'L (350)', priceDiff: 24 },
            ],
          },
          {
            id: '2',
            name: 'Молоко',
            values: [
              { id: '1', name: 'Звичайне', priceDiff: 0 },
              { id: '2', name: 'Безлактозне', priceDiff: 11 },
              { id: '3', name: 'Рослинне', priceDiff: 22 },
            ],
          },
        ],
      },
      {
        id: '11',
        categoryId: '2',
        name: 'Флет',
        price: 50,
        photoUrl: null,
        options: [
          {
            id: '1',
            name: 'Розмір',
            values: [
              { id: '1', name: 'S (150)', priceDiff: 0 },
              { id: '2', name: 'M (250)', priceDiff: 12 },
              { id: '3', name: 'L (350)', priceDiff: 24 },
            ],
          },
          {
            id: '2',
            name: 'Молоко',
            values: [
              { id: '1', name: 'Звичайне', priceDiff: 0 },
              { id: '2', name: 'Безлактозне', priceDiff: 11 },
              { id: '3', name: 'Рослинне', priceDiff: 22 },
            ],
          },
        ],
      },
      {
        id: '3',
        categoryId: '2',
        name: 'Капуч на безлактозном',
        price: 60,
        photoUrl: null,
        options: [],
      },
      {
        id: '4',
        categoryId: '2',
        name: 'Капуч на рослинном',
        price: 70,
        photoUrl: null,
        options: [],
      },
      {
        id: '6',
        categoryId: '4',
        name: 'Печиво з фініком',
        price: 15,
        photoUrl: null,
        options: [],
      },
      {
        id: '7',
        categoryId: '3',
        name: 'Колдбрю',
        price: 35,
        photoUrl: null,
        options: [],
      },
      {
        id: '9',
        categoryId: '4',
        name: 'Тарт з лимоном',
        price: 90,
        photoUrl: null,
        options: [],
      },
      {
        id: '10',
        categoryId: '4',
        name: 'Тарт з лохиною',
        price: 91,
        photoUrl: null,
        options: [],
      },
    ]);
  }

  getProductById(productId: string): IProduct {
    return this.products().find(product => product.id === productId) as IProduct;
  }
}
