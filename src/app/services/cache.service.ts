import { effect, Injectable, signal } from '@angular/core';

interface ICache {
  [cacheType: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {

  private persistedCacheKey = `posh-cache`;

  private cache = signal<ICache>(this.getPersistedCache());

  constructor() {
    effect(() => this.persistCache(this.cache()));
  }

  getFromCache<T>(cacheType: string, defaultValue: T): T {
    return this.cache()[cacheType] as T || defaultValue;
  }

  addToCache<T = unknown>(cacheType: string, payload: T): void {
    this.cache.update(cache => {
      cache = structuredClone(cache);

      cache[cacheType] = payload;

      return cache;
    });
  }

  private persistCache(cache: ICache): void {
    localStorage.setItem(this.persistedCacheKey, JSON.stringify(cache));
  }

  private getPersistedCache(): ICache {
    const persistedCache = localStorage.getItem(this.persistedCacheKey);
    return persistedCache ? JSON.parse(persistedCache) : {};
  }
}
