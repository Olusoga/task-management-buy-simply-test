import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import {map, Observable} from 'rxjs';

interface ResponseWrapper<T> {
  status: string;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseWrapper<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWrapper<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data: T) => ({
        status: 'success',
        message: request.message || 'Request successful',
        data,
      })),
    );
  }
}
