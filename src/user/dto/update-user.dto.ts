import {ApiProperty} from '@nestjs/swagger';
import {IsOptional, IsBoolean} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
  })
  @IsOptional()
  lastName: string;

  @IsOptional()
  @ApiProperty({
    example: false,
    description: 'user status',
  })
  @IsBoolean()
  isActive?: boolean;
}
