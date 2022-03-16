import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addToCache(key: string, item: string) {
    await this.cacheManager.set(key, item);
  }

  async getFromCache(key: string) {
    const value = await this.cacheManager.get(key);
    return value;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
