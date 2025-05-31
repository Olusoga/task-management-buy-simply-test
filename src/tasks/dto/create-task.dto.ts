import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
  IsUUID,
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import {TaskPriority, TaskStatus} from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
    example: 'Implement authentication',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Implement JWT authentication with refresh tokens',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'User ID to whom the task is assigned',
    example: 'b3b1aab4-5a67-4f7e-9a21-3c6fcd902f4a',
  })
  @IsUUID()
  assignedTo: string;

  @ApiProperty({
    description: 'User ID who created the task',
    example: 'd4c9b1f2-765f-4b1d-ae22-12aabcde4567',
  })
  @IsUUID()
  createdBy: string;

  @ApiPropertyOptional({
    description: 'Status of the task',
    enum: TaskStatus,
    example: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO;

  @ApiPropertyOptional({
    description: 'Priority of the task',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @ApiPropertyOptional({
    description: 'Due date of the task (ISO 8601 format)',
    example: '2025-06-30T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
