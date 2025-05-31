import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {UserService} from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {Roles} from 'src/common/decorators/roles.decorator';
import {UserRole} from './entities/user.entity';
import {SignupDto} from './dto/signup.dto';
import {JwtAuthGuard} from 'src/auth/guards/jwt-auth-guard';
import {RolesGuard} from 'src/common/guards/roles-guard';
import {AuthGuard} from '@nestjs/passport';
import {UpdateUserDto} from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.ADMIN)
  @ApiOperation({summary: 'List all users (Admin only)'})
  @ApiResponse({status: 200, description: 'Users retrieved successfully'})
  async findAll(@Req() req) {
    req.message = 'Users retrieved successfully';
    return this.userService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({summary: 'Get authenticated user profile'})
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  async findOne(@Req() req) {
    req.message = 'User profile retrieved successfully';
    return this.userService.findOne(req.user.id);
  }

  @Post('signup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: 'Register a new user (Admin only)'})
  @ApiResponse({status: 201, description: 'User created successfully'})
  @ApiResponse({status: 409, description: 'Email already exists'})
  async signup(@Body() signupDto: SignupDto, @Req() req) {
    req.message = 'User created successfully';
    return this.userService.createUser(signupDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  @ApiOperation({summary: 'Update user profile (self-only)'})
  @ApiResponse({status: 200, description: 'User updated successfully'})
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Cannot update another user',
  })
  @ApiResponse({status: 404, description: 'User not found'})
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    const currentUserId = req.user?.id;
    req.message = 'User updated successfully';
    return this.userService.updateUser(id, updateUserDto, currentUserId);
  }
}
