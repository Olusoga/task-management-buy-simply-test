import {Module} from '@nestjs/common';
import {LoggingService} from './logging.service';
import {RequestContextService} from 'src/common/request-context/request-context';

@Module({
  providers: [LoggingService, RequestContextService],
  exports: [LoggingService],
})
export class LoggingModule {}
