import {IsEnum, IsOptional, IsNumber, IsString} from 'class-validator';
import {Type} from 'class-transformer';
import {TaskStatus, TaskPriority} from '../entities/task.entity';
import {ApiPropertyOptional} from '@nestjs/swagger';

export class FilterTasksDto {
  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Filter tasks by status',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    description: 'Filter tasks by priority',
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    type: Number,
    default: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page = 1;

  @ApiPropertyOptional({
    type: Number,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit = 10;

  @ApiPropertyOptional({
    type: String,
    description: 'Search term to filter tasks by title or description',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
