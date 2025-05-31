import {Module} from '@nestjs/common';
import {TasksService} from './service/tasks.service';
import {TasksController} from './controller/tasks.controller';
import {CreateTaskHandler} from './commands/handlers/create-task.handler';
import {DeleteTaskHandler} from './commands/handlers/delete-task.command';
import {UpdateTaskHandler} from './commands/handlers/update-task.handler';
import {GetTaskByIdHandler} from './queries/handlers/get-task-by-id.handler';
import {GetTasksHandler} from './queries/handlers/get-task.query';
import {TaskCreatedEvent} from './events/task-created.event';
import {TaskDeletedEvent} from './events/task-deleted.event';
import {TaskUpdatedEvent} from './events/task-updated.event';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Task} from './entities/task.entity';
import {CqrsModule, EventBus} from '@nestjs/cqrs';
import {UserService} from 'src/user/services/user.service';
import {UserModule} from 'src/user/user.module';
import {LoggingService} from 'src/logging/logging.service';
import {RequestContextService} from 'src/common/request-context/request-context';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), CqrsModule, UserModule],
  controllers: [TasksController],
  providers: [
    UserService,
    LoggingService,
    RequestContextService,
    TasksService,
    TasksService,
    CreateTaskHandler,
    UpdateTaskHandler,
    DeleteTaskHandler,
    GetTasksHandler,
    GetTaskByIdHandler,
    TaskCreatedEvent,
    TaskUpdatedEvent,
    TaskDeletedEvent,
    EventBus,
  ],
})
export class TasksModule {}
