import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import {Response} from 'express';
type BadRequestResponse = {message: string | {errors: string[]}[]};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;

    if (
      exception instanceof BadRequestException &&
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const badReq = exceptionResponse as BadRequestResponse;

      if (Array.isArray(badReq.message)) {
        message = badReq.message.map((err) => err.errors.join(', ')).join(', ');
      } else {
        message = badReq.message;
      }
    }
    response.status(status).json({statusCode: status, message});
  }
}
