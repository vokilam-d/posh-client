import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ICategory } from '../../interfaces/category.interface';
import { ImgComponent } from '../img/img.component';

@Component({
  selector: 'app-category-tabs',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ImgComponent,
  ],
  templateUrl: './category-tabs.component.html',
  styleUrl: './category-tabs.component.scss'
})
export class CategoryTabsComponent {
  categoryId = input<string | null>(null);

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

  getRouterLinkCommands(category: ICategory): string[] {
    const commands = ['/', 'pos', 'category'];
    if (category.id) {
      commands.push(category.id);
    }
    return commands;
  }
}
