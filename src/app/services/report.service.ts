import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { OrdersReportDto } from '../dtos/orders-report.dto';
import { GetOrdersReportQueryDto } from '../dtos/get-orders-report-query.dto';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly httpClient = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/reports`;

  constructor() {
  }

  fetchOrderReport(queryDto: GetOrdersReportQueryDto): Observable<OrdersReportDto> {
    const params = {};
    Object.assign(params, queryDto);

    return this.httpClient.get<OrdersReportDto>(`${this.apiUrl}/orders`, { params });
  }
}
