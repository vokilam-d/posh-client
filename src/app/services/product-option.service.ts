import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { getHttpErrorMessage } from '../utils/get-http-error-message.util';
import { Observable, tap } from 'rxjs';
import { ProductOptionDto } from '../dtos/product-option.dto';
import { CreateOrUpdateProductOptionDto } from '../dtos/create-or-update-product-option.dto';
import { ProductOptionValueDto } from '../dtos/product-option-value.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductOptionService {

  cachedProductOptions = signal<ProductOptionDto[]>([]);

  private readonly httpClient = inject(HttpClient);
  private readonly toastr = inject(ToastrService);

  private readonly apiUrl = `${environment.apiUrl}/product-options`;

  constructor() {
    this.cacheProductOptions();
  }

  cacheProductOptions(): void {
    this.fetchProductOptions().subscribe(
      response => this.cachedProductOptions.set(response),
      error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося закешувати опції товарів`),
    );
  }

  getProductOption(optionId: string): ProductOptionDto {
    return this.cachedProductOptions().find(option => option.id === optionId);
  }

  getProductOptionName(optionId: string): string {
    return this.getProductOption(optionId)?.name;
  }

  getProductOptionValue(optionId: string, valueId: string): ProductOptionValueDto {
    return this.cachedProductOptions()
      .find(option => option.id === optionId)
      ?.values
      .find(value => value.id === valueId);
  }

  getProductOptionValueName(optionId: string, valueId: string): string {
    return this.getProductOptionValue(optionId, valueId)?.name;
  }

  fetchProductOptions(): Observable<ProductOptionDto[]> {
    return this.httpClient.get<ProductOptionDto[]>(this.apiUrl);
  }

  fetchProductOptionById(productOptionId: string): Observable<ProductOptionDto> {
    return this.httpClient.get<ProductOptionDto>(`${this.apiUrl}/${productOptionId}`);
  }

  create(productOptionDto: CreateOrUpdateProductOptionDto): Observable<ProductOptionDto> {
    return this.httpClient.post<ProductOptionDto>(this.apiUrl, productOptionDto)
      .pipe(tap(() => this.cacheProductOptions()));
  }

  update(productOptionId: string, productOptionDto: CreateOrUpdateProductOptionDto): Observable<ProductOptionDto> {
    return this.httpClient.put<ProductOptionDto>(`${this.apiUrl}/${productOptionId}`, productOptionDto)
      .pipe(tap(() => this.cacheProductOptions()));
  }

  deleteProductOption(productOptionId: string): Observable<ProductOptionDto> {
    return this.httpClient.delete<ProductOptionDto>(`${this.apiUrl}/${productOptionId}`)
      .pipe(tap(() => this.cacheProductOptions()));
  }
}
