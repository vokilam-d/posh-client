import { Injectable, signal } from '@angular/core';
import { ICategory } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories = signal<ICategory[]>([]);

  constructor() { }

  fetchCategories(): void {
    this.categories.set([
      {
        id: '1',
        parentCategoryId: null,
        name: 'Кава без молока',
      },
      {
        id: '2',
        parentCategoryId: null,
        name: 'Кава з молоком',
      },
      {
        id: '4',
        parentCategoryId: null,
        name: 'Солодке',
      },
      {
        id: '3',
        parentCategoryId: null,
        name: 'Полка',
      },
    ]);
  }

  getCategoryById(categoryId: string): ICategory {
    return this.categories().find(category => category.id === categoryId) as ICategory;
  }
}
