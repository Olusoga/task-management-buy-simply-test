import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {APP_GUARD} from '@nestjs/core';
import {RolesGuard} from 'src/common/guards/roles-guard';
import {JwtAuthGuard} from 'src/auth/guards/jwt-auth-guard';
import {JwtStrategy} from 'src/auth/strategies/jwt-strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    JwtAuthGuard,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
