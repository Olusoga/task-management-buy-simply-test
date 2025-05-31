import {Controller, Post, Body} from '@nestjs/common';
import {AuthService} from './auth.service';
import {ApiTags, ApiOperation, ApiBody} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({summary: 'Login a user and return JWT'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {type: 'string', example: 'user@example.com'},
        password: {type: 'string', example: 'Password@123'},
      },
      required: ['email', 'password'],
    },
  })
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  @Post('logout')
  @ApiOperation({summary: 'Logout user (stateless)'})
  logout() {
    return this.authService.logout();
  }
}
