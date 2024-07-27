import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { OrderDto } from '../dtos/order.dto';
import { CreateOrUpdateOrderDto } from '../dtos/create-or-update-order.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly httpClient = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/orders`;

  constructor() {
  }

  fetchOrders(): Observable<OrderDto[]> {
    return this.httpClient.get<OrderDto[]>(this.apiUrl);
  }

  fetchOrderById(orderId: string): Observable<OrderDto> {
    return this.httpClient.get<OrderDto>(`${this.apiUrl}/${orderId}`);
  }

  create(orderDto: CreateOrUpdateOrderDto): Observable<OrderDto> {
    return this.httpClient.post<OrderDto>(this.apiUrl, orderDto);
  }

  deleteOrder(orderId: string): Observable<OrderDto> {
    return this.httpClient.delete<OrderDto>(`${this.apiUrl}/${orderId}`);
  }
}
