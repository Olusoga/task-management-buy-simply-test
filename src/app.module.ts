import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UserModule, AuthModule,  DatabaseModule],
})
export class AppModule {}
