import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

interface StandardResponse<T> {
  status: 'success';
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        status: 'success',
        message:
          context.switchToHttp().getRequest().customMessage ||
          'Request successful',
        data,
      })),
    );
  }
}
