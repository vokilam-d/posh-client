import { Component, computed, inject, input } from '@angular/core';
import { IProduct } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ICategory } from '../../interfaces/category.interface';

@Component({
  selector: 'app-category-tabs',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './category-tabs.component.html',
  styleUrl: './category-tabs.component.scss'
})
export class CategoryTabsComponent {
  categoryId = input<string | null>(null);

  // parentCategoriesRows = computed<IProduct[][]>(() => {
  //   let categoryId = this.categoryId();
  //   if (!categoryId) {
  //     return [];
  //   }
  //
  //   const parentCategoriesRows = [];
  //   //
  //   // while (categoryId) {
  //   //   const category = this.productsService.getProductById(categoryId);
  //   //   parentCategoriesRows.unshift(this.getSiblingCategories(category));
  //   //
  //   //   categoryId = category.categoryId;
  //   // }
  //
  //   return parentCategoriesRows;
  // });

  private productsService = inject(ProductService);
  private categoryService = inject(CategoryService);

  categoriesRows = computed<ICategory[][]>(() => {
    const categories = this.categoryService.categories();

    const categoriesRows = [];
    let parentCategoryId = this.categoryId() || null;
    while (true) {
      const parentCategory = this.categoryService.getCategoryById(parentCategoryId as string);

      const siblingCategories = categories.filter(cat => cat.parentCategoryId === parentCategoryId);
      if (siblingCategories.length) {
        siblingCategories.unshift({
          id: parentCategoryId as string,
          name: `Всі`,
          parentCategoryId: null,
        });
      }
      categoriesRows.unshift(siblingCategories);

      if (!parentCategoryId) {
        break;
      } else {
        parentCategoryId = parentCategory?.parentCategoryId;
      }
    }

    return categoriesRows;
  });

  private getSiblingCategories(productCategory: IProduct) {
    return this.productsService.products().filter(product => {
      return product.categoryId === productCategory.categoryId;
    });
  }

  getRouterLinkCommands(category: ICategory): string[] {
    const commands = ['/', 'pos', 'category'];
    if (category.id) {
      commands.push(category.id);
    }
    return commands;
  }
}
