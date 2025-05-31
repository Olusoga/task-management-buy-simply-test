import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {UserService} from './user.service';
import {ApiBearerAuth, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {Roles} from 'src/common/decorators/roles.decorator';
import {User, UserRole} from './entities/user.entity';
import {SignupDto} from './dto/signup.dto';
import {JwtAuthGuard} from 'src/auth/guards/jwt-auth-guard';
import {RolesGuard} from 'src/common/guards/roles-guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.ADMIN)
  @ApiOperation({summary: 'List all users '})
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: 'Get a user by ID'})
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post('signup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({status: 201, description: 'User successfully registered'})
  @ApiResponse({status: 409, description: 'Email already exists'})
  async signup(@Body() signupDto: SignupDto): Promise<Omit<User, 'password'>> {
    return this.userService.createUser(signupDto);
  }
}
