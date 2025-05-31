import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserService} from 'src/user/user.service';
import {UserModule} from 'src/user/user.module';
import {JwtModule, JwtService} from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import {JwtAuthGuard} from 'src/auth/guards/jwt-auth-guard';
import {JwtStrategy} from './strategies/jwt-strategy';
import {LoggingModule} from 'src/logging/logging.module';
dotenv.config();

@Module({
  imports: [
    LoggingModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1h'},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService, JwtAuthGuard, JwtStrategy],
  exports: [JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
