import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { getHttpErrorMessage } from '../utils/get-http-error-message.util';
import { Observable } from 'rxjs';
import { CategoryDto } from '../dtos/category.dto';
import { CreateOrUpdateCategoryDto } from '../dtos/create-or-update-category.dto';
import { ReorderCategoriesDto, ReorderCategoryDto } from '../dtos/reorder-categories.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  cachedCategories = signal<CategoryDto[]>([]);

  private readonly httpClient = inject(HttpClient);
  private readonly toastr = inject(ToastrService);

  private readonly apiUrl = `${environment.apiUrl}/categories`;

  cacheCategories(): void {
    this.fetchCategories().subscribe(
      response => this.cachedCategories.set(response),
      error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося отримати категорії`),
    );
  }

  fetchCategories(): Observable<CategoryDto[]> {
    return this.httpClient.get<CategoryDto[]>(this.apiUrl);
  }

  fetchCategoryById(categoryId: string): Observable<CategoryDto> {
    return this.httpClient.get<CategoryDto>(`${this.apiUrl}/${categoryId}`);
  }

  create(categoryDto: CreateOrUpdateCategoryDto): Observable<CategoryDto> {
    return this.httpClient.post<CategoryDto>(this.apiUrl, categoryDto);
  }

  update(categoryId: string, categoryDto: CreateOrUpdateCategoryDto): Observable<CategoryDto> {
    return this.httpClient.put<CategoryDto>(`${this.apiUrl}/${categoryId}`, categoryDto);
  }

  deleteCategory(categoryId: string): Observable<CategoryDto> {
    return this.httpClient.delete<CategoryDto>(`${this.apiUrl}/${categoryId}`);
  }

  reorderCategories(reorderedCategories: ReorderCategoryDto[]): Observable<CategoryDto[]> {
    const dto: ReorderCategoriesDto = {
      categories: reorderedCategories,
    };

    return this.httpClient.post<CategoryDto[]>(`${this.apiUrl}/reorder`, dto);
  }
}
