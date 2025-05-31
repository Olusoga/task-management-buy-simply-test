import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {User} from 'src/user/entities/user.entity';
import {UserService} from 'src/user/services/user.service';
import {stripPasswordOnly} from 'src/utils/strip-password';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {LoggingService} from 'src/logging/logging.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggingService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{accessToken: string; user: Omit<User, 'password'>}> {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        this.logger.warn(`Login failed: User with email ${email} not found`);
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.logger.warn(
          `Login failed: Invalid password for user with email ${email}`,
        );
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = {sub: user.id, email: user.email, role: user.role};
      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '3600s',
      });

      return {
        user: stripPasswordOnly(user),
        accessToken: access_token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Login error for email ${email}`, error.stack);
      throw new InternalServerErrorException('An error occurred during login');
    }
  }

  async logout(): Promise<{message: string}> {
    // For JWT-based auth, logout is handled on the client side
    return {message: 'Logout successful (token should be discarded on client)'};
  }
}
