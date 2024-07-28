import { DestroyRef, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, concat, filter, finalize, Observable, of, tap } from 'rxjs';
import { OrderDto } from '../dtos/order.dto';
import { CreateOrUpdateOrderDto } from '../dtos/create-or-update-order.dto';
import { ConnectionService } from './connection.service';
import { CacheService } from './cache.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly httpClient = inject(HttpClient);
  private readonly connectionService = inject(ConnectionService);
  private readonly cacheService = inject(CacheService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  private readonly apiUrl = `${environment.apiUrl}/orders`;
  private readonly cacheTypeKey = `new-orders`;

  constructor() {
    this.connectionService.isOnline$
      .pipe(
        filter(isOnline => isOnline),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.createCachedOrders());
  }

  fetchOrders(): Observable<OrderDto[]> {
    return this.httpClient.get<OrderDto[]>(this.apiUrl);
  }

  fetchOrderById(orderId: string): Observable<OrderDto> {
    return this.httpClient.get<OrderDto>(`${this.apiUrl}/${orderId}`);
  }

  create(orderDto: CreateOrUpdateOrderDto): Observable<OrderDto | null> {
    if (this.connectionService.isOnline) {
      return this.httpClient.post<OrderDto>(this.apiUrl, orderDto);
    } else {
      this.appendToCache(orderDto);
      return of(null);
    }
  }

  deleteOrder(orderId: string): Observable<OrderDto> {
    return this.httpClient.delete<OrderDto>(`${this.apiUrl}/${orderId}`);
  }

  private appendToCache(orderDto: CreateOrUpdateOrderDto): void {
    const pendingCachedOrders = this.cacheService.getFromCache<CreateOrUpdateOrderDto[]>(this.cacheTypeKey, []);
    pendingCachedOrders.push(orderDto);
    this.cacheService.addToCache(this.cacheTypeKey, pendingCachedOrders);
  }

  private createCachedOrders() {
    const pendingCachedOrders = this.cacheService.getFromCache<CreateOrUpdateOrderDto[]>(this.cacheTypeKey, []);
    if (!pendingCachedOrders.length) {
      return;
    }
    this.cacheService.addToCache(this.cacheTypeKey, []);

    const failedDtos: CreateOrUpdateOrderDto[] = [];

    const buildReq = (orderDto: CreateOrUpdateOrderDto) => this.create(orderDto).pipe(
      catchError(() => {
        failedDtos.push(orderDto);
        return of(null);
      }),
    );

    concat(...pendingCachedOrders.map(buildReq))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          let message: string = `Зв'язок відновився. `;
          message += failedDtos.length
            ? `${failedDtos.length} замовлень не вийшло створити`
            : `Всі замовлення успішно створені`;

          if (failedDtos.length) {
            this.toastr.warning(message);
          } else {
            this.toastr.success(message);
          }
        })
      )
      .subscribe();
  }
}
