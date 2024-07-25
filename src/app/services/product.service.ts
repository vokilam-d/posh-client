import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { getHttpErrorMessage } from '../utils/get-http-error-message.util';
import { Observable, tap } from 'rxjs';
import { ProductDto } from '../dtos/product.dto';
import { CreateOrUpdateProductDto } from '../dtos/create-or-update-product.dto';
import { ReorderProductsDto, ReorderProductDto } from '../dtos/reorder-products.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  cachedProducts = signal<ProductDto[]>([]);

  private readonly httpClient = inject(HttpClient);
  private readonly toastr = inject(ToastrService);

  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor() {
    this.cacheProducts();
  }

  cacheProducts(): void {
    this.fetchProducts().subscribe({
      next: response => this.cachedProducts.set(response),
      error: error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося отримати категорії`),
    });
  }

  fetchProducts(): Observable<ProductDto[]> {
    return this.httpClient.get<ProductDto[]>(this.apiUrl)
  }

  fetchProductById(productId: string): Observable<ProductDto> {
    return this.httpClient.get<ProductDto>(`${this.apiUrl}/${productId}`);
  }

  create(productDto: CreateOrUpdateProductDto): Observable<ProductDto> {
    return this.httpClient.post<ProductDto>(this.apiUrl, productDto)
      .pipe(tap(() => this.cacheProducts()));
  }

  update(productId: string, productDto: CreateOrUpdateProductDto): Observable<ProductDto> {
    return this.httpClient.put<ProductDto>(`${this.apiUrl}/${productId}`, productDto)
      .pipe(tap(() => this.cacheProducts()));
  }

  deleteProduct(productId: string): Observable<ProductDto> {
    return this.httpClient.delete<ProductDto>(`${this.apiUrl}/${productId}`)
      .pipe(tap(() => this.cacheProducts()));
  }

  reorderProducts(reorderedProducts: ReorderProductDto[]): Observable<ProductDto[]> {
    const dto: ReorderProductsDto = {
      products: reorderedProducts,
    };

    return this.httpClient.post<ProductDto[]>(`${this.apiUrl}/reorder`, dto)
      .pipe(tap(response => this.cachedProducts.set(response)));
  }
}
