import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { getHttpErrorMessage } from '../utils/get-http-error-message.util';
import { filter, Observable, tap } from 'rxjs';
import { ProductDto } from '../dtos/product.dto';
import { CreateOrUpdateProductDto } from '../dtos/create-or-update-product.dto';
import { ReorderProductsDto, ReorderProductDto } from '../dtos/reorder-products.dto';
import { ConnectionService } from './connection.service';
import { CacheService } from './cache.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  cachedProducts = computed<ProductDto[]>(() => this.cacheService.getFromCache<ProductDto[]>(this.cacheTypeKey, []));

  private readonly httpClient = inject(HttpClient);
  private readonly toastr = inject(ToastrService);
  private readonly connectionService = inject(ConnectionService);
  private readonly cacheService = inject(CacheService);

  private readonly apiUrl = `${environment.apiUrl}/products`;
  private readonly cacheTypeKey = `products`;

  constructor() {
    if (this.connectionService.isOnline) {
      this.fetchAndCacheProducts();
    } else {
      this.connectionService.isOnline$
        .pipe(
          filter(isOnline => isOnline),
          takeUntilDestroyed(),
        )
        .subscribe(() => this.fetchAndCacheProducts());
    }
  }

  private fetchAndCacheProducts(): void {
    this.fetchProducts().subscribe({
      next: response => this.addToCache(response),
      error: error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося закешувати товари`),
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
      .pipe(tap(() => this.fetchAndCacheProducts()));
  }

  update(productId: string, productDto: CreateOrUpdateProductDto): Observable<ProductDto> {
    return this.httpClient.put<ProductDto>(`${this.apiUrl}/${productId}`, productDto)
      .pipe(tap(() => this.fetchAndCacheProducts()));
  }

  deleteProduct(productId: string): Observable<ProductDto> {
    return this.httpClient.delete<ProductDto>(`${this.apiUrl}/${productId}`)
      .pipe(tap(() => this.fetchAndCacheProducts()));
  }

  reorderProducts(reorderedProducts: ReorderProductDto[]): Observable<ProductDto[]> {
    const dto: ReorderProductsDto = {
      products: reorderedProducts,
    };

    return this.httpClient.post<ProductDto[]>(`${this.apiUrl}/reorder`, dto)
      .pipe(tap(response => this.addToCache(response)));
  }

  private addToCache(products: ProductDto[]): void {
    this.cacheService.addToCache(this.cacheTypeKey, products);
  }
}
