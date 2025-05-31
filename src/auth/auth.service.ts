import {Injectable, UnauthorizedException} from '@nestjs/common';
import {User} from 'src/user/entities/user.entity';
import {UserService} from 'src/user/user.service';
import {stripPasswordOnly} from 'src/utils/strip-password';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{accessToken: string; user: Omit<User, 'password'>}> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {sub: user.id, email: user.email, role: user.role};
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '3600s',
    });

    return {
      accessToken: access_token,
      user: stripPasswordOnly(user),
    };
  }

  async logout(): Promise<{message: string}> {
    // For JWT-based auth, logout is handled on the client side
    return {message: 'Logout successful (token should be discarded on client)'};
  }
}
