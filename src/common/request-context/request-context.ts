import {Injectable} from '@nestjs/common';
import {AsyncLocalStorage} from 'async_hooks';

interface RequestContext {
  userId: string;
  requestId: string;
}

@Injectable()
export class RequestContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  run(context: RequestContext, callback: () => void) {
    this.asyncLocalStorage.run(context, callback);
  }

  getUserId(): string | null {
    return this.asyncLocalStorage.getStore()?.userId || null;
  }

  getRequestId(): string | null {
    return this.asyncLocalStorage.getStore()?.requestId || null;
  }
}
