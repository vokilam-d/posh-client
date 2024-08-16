import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ImgComponent } from '../img/img.component';
import { CategoryDto } from '../../dtos/category.dto';

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

  readonly categoryService = inject(CategoryService);

  categoryId = input<string | null>(null);
  categories = computed<CategoryDto[]>(() => {
    return [
      {
        id: null,
        name: `Всі`,
        isEnabled: true,
        photoUrl: null,
        sortOrder: null,
        createdAtIso: null,
        updatedAtIso: null,
      },
      ...this.categoryService.cachedEnabledCategories(),
    ]
  })

  getRouterLinkCommands(category: CategoryDto): string[] {
    const commands = ['/', 'pos', 'category'];
    if (category.id) {
      commands.push(category.id);
    }
    return commands;
  }
}
