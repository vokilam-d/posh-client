import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, finalize, Observable, of, tap, timeout } from 'rxjs';
import { CHECK_CONNECTION_STATUS_INTERVAL_MS } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  isOnline$ = new BehaviorSubject<boolean>(false);
  get isOnline(): boolean { return this.isOnline$.getValue(); }

  private readonly httpClient = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/health`;

  constructor() {
  }

  checkConnectionStatus(): Observable<unknown> {
    return this.fetchHealth()
      .pipe(
        timeout(1000),
        tap({
          next: () => this.isOnline$.next(true),
          error: () => this.isOnline$.next(false),
        }),
        finalize(() => setTimeout(() => this.checkConnectionStatus().subscribe(), CHECK_CONNECTION_STATUS_INTERVAL_MS)),
        catchError(() => of(null)),
      );
  }

  private fetchHealth(): Observable<{ isHealthy: true }> {
    return this.httpClient.get<{ isHealthy: true }>(this.apiUrl);
  }
}
