import {Controller, Post, Body, HttpCode, HttpStatus} from '@nestjs/common';
import {AuthService} from './auth.service';
import {ApiTags, ApiResponse} from '@nestjs/swagger';
import {SignupDto} from 'src/user/dto/signup.dto';
import {User} from 'src/user/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({status: 201, description: 'User successfully registered'})
  @ApiResponse({status: 409, description: 'Email already exists'})
  async signup(@Body() signupDto: SignupDto): Promise<Omit<User, 'password'>> {
    return this.authService.signup(signupDto);
  }
}
