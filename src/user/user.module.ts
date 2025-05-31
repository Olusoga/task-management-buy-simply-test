import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {JwtAuthGuard} from 'src/auth/guards/jwt-auth-guard';
import {JwtStrategy} from 'src/auth/strategies/jwt-strategy';
import {LoggingModule} from 'src/logging/logging.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LoggingModule],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, JwtStrategy],
  exports: [TypeOrmModule],
})
export class UserModule {}
