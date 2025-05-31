import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {FilterTasksDto} from './dto/filter-task.dto';
import {GetTasksQuery} from './queries/impl/get-task.query';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {GetTaskByIdQuery} from './queries/impl/get-task-by-id.query';
import {UpdateTaskCommand} from './commands/impl/updates-task.command';
import {DeleteTaskCommand} from './commands/impl/delete-task.command';
import {CreateTaskCommand} from './commands/impl/create-task.command';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {JwtAuthGuard} from 'src/auth/guards/jwt-auth-guard';
import {Roles} from 'src/common/decorators/roles.decorator';
import {RolesGuard} from 'src/common/guards/roles-guard';
import {UserRole} from 'src/user/entities/user.entity';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.ADMIN)
  @ApiOperation({summary: 'Get all tasks (Admin only)'})
  @ApiResponse({status: 200, description: 'Tasks retrieved successfully'})
  getTasks(@Query() filter: FilterTasksDto, @Req() req) {
    req.message = 'Tasks retrieved successfully';
    return this.queryBus.execute(new GetTasksQuery(filter));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({summary: 'Get task by ID (Authenticated users)'})
  @ApiResponse({status: 200, description: 'Task retrieved successfully'})
  @ApiResponse({status: 404, description: 'Task not found'})
  getTaskById(@Param('id') id: string, @Req() req) {
    req.message = 'Task retrieved successfully';
    return this.queryBus.execute(new GetTaskByIdQuery(id, req.user.id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({summary: 'Create a new task (Authenticated users)'})
  @ApiResponse({status: 201, description: 'Task created successfully'})
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    req.message = 'Task created successfully';
    return this.commandBus.execute(new CreateTaskCommand(createTaskDto));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({summary: 'Update a task (Authenticated users)'})
  @ApiResponse({status: 200, description: 'Task updated successfully'})
  @ApiResponse({status: 403, description: 'Forbidden'})
  @ApiResponse({status: 404, description: 'Task not found'})
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ) {
    req.message = 'Task updated successfully';
    return this.commandBus.execute(
      new UpdateTaskCommand(id, updateTaskDto, req.user.id),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({summary: 'Delete a task (Authenticated users)'})
  @ApiResponse({status: 200, description: 'Task deleted successfully'})
  @ApiResponse({status: 404, description: 'Task not found'})
  remove(@Param('id') id: string, @Req() req) {
    req.message = 'Task deleted successfully';
    return this.commandBus.execute(new DeleteTaskCommand(id));
  }
}
