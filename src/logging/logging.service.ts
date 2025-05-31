import {Injectable} from '@nestjs/common';
import {LoggerService} from '@nestjs/common';
import {logger} from './logger';
import {RequestContextService} from 'src/common/request-context/request-context';

@Injectable()
export class LoggingService implements LoggerService {
  constructor(private readonly context: RequestContextService) {}

  log(message: string, meta: Record<string, unknown> = {}) {
    logger.info(message, {
      ...meta,
      userId: this.context.getUserId(),
      requestId: this.context.getRequestId(),
      timestamp: new Date().toISOString(),
    });
  }

  info(message: string, meta: Record<string, unknown> = {}) {
    logger.info(message, {
      ...meta,
      userId: this.context.getUserId(),
      requestId: this.context.getRequestId(),
      timestamp: new Date().toISOString(),
    });
  }

  error(message: string, meta: Record<string, unknown> = {}) {
    logger.error(message, {
      ...meta,
      userId: this.context.getUserId(),
      requestId: this.context.getRequestId(),
      timestamp: new Date().toISOString(),
    });
  }

  warn(message: string, meta: Record<string, unknown> = {}) {
    logger.warn(message, {
      ...meta,
      userId: this.context.getUserId(),
      requestId: this.context.getRequestId(),
      timestamp: new Date().toISOString(),
    });
  }

  debug(message: string, meta: Record<string, unknown> = {}) {
    logger.debug(message, {
      ...meta,
      userId: this.context.getUserId(),
      requestId: this.context.getRequestId(),
      timestamp: new Date().toISOString(),
    });
  }
}
