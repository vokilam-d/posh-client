import { computed, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { getHttpErrorMessage } from '../utils/get-http-error-message.util';
import { filter, Observable, tap } from 'rxjs';
import { CategoryDto } from '../dtos/category.dto';
import { CreateOrUpdateCategoryDto } from '../dtos/create-or-update-category.dto';
import { ReorderCategoriesDto, ReorderCategoryDto } from '../dtos/reorder-categories.dto';
import { ConnectionService } from './connection.service';
import { CacheService } from './cache.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  cachedCategories = computed<CategoryDto[]>(() => {
    return this.cacheService.getFromCache<CategoryDto[]>(this.cacheTypeKey, []);
  });
  cachedEnabledCategories = computed<CategoryDto[]>(() => this.cachedCategories().filter(c => c.isEnabled));

  private readonly httpClient = inject(HttpClient);
  private readonly toastr = inject(ToastrService);
  private readonly connectionService = inject(ConnectionService);
  private readonly cacheService = inject(CacheService);

  private readonly apiUrl = `${environment.apiUrl}/categories`;
  private readonly cacheTypeKey = `categories`;

  constructor() {
    if (this.connectionService.isOnline) {
      this.fetchAndCacheCategories();
    } else {
      this.connectionService.isOnline$
        .pipe(
          filter(isOnline => isOnline),
          takeUntilDestroyed(),
        )
        .subscribe(() => this.fetchAndCacheCategories());
    }
  }

  private fetchAndCacheCategories(): void {
    this.fetchCategories().subscribe({
      next: response => this.addToCache(response),
      error: error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося закешувати категорії`),
    });
  }

  getCategoryName(categoryId: string): string {
    return this.cachedCategories().find(category => category.id === categoryId)?.name;
  }

  fetchCategories(): Observable<CategoryDto[]> {
    return this.httpClient.get<CategoryDto[]>(this.apiUrl)
  }

  fetchCategoryById(categoryId: string): Observable<CategoryDto> {
    return this.httpClient.get<CategoryDto>(`${this.apiUrl}/${categoryId}`);
  }

  create(categoryDto: CreateOrUpdateCategoryDto): Observable<CategoryDto> {
    return this.httpClient.post<CategoryDto>(this.apiUrl, categoryDto)
      .pipe(tap(() => this.fetchAndCacheCategories()));
  }

  update(categoryId: string, categoryDto: CreateOrUpdateCategoryDto): Observable<CategoryDto> {
    return this.httpClient.put<CategoryDto>(`${this.apiUrl}/${categoryId}`, categoryDto)
      .pipe(tap(() => this.fetchAndCacheCategories()));
  }

  deleteCategory(categoryId: string): Observable<CategoryDto> {
    return this.httpClient.delete<CategoryDto>(`${this.apiUrl}/${categoryId}`)
      .pipe(tap(() => this.fetchAndCacheCategories()));
  }

  reorderCategories(reorderedCategories: ReorderCategoryDto[]): Observable<CategoryDto[]> {
    const dto: ReorderCategoriesDto = {
      categories: reorderedCategories,
    };

    return this.httpClient.post<CategoryDto[]>(`${this.apiUrl}/reorder`, dto)
      .pipe(tap(response => this.addToCache(response)));
  }

  private addToCache(categories: CategoryDto[]): void {
    this.cacheService.addToCache(this.cacheTypeKey, categories);
  }
}
