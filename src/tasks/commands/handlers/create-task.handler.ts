import {CommandHandler, ICommandHandler, EventBus} from '@nestjs/cqrs';
import {TasksService} from '../../tasks.service';
import {CreateTaskCommand} from '../impl/create-task.command';
import {TaskCreatedEvent} from '../../events/task-created.event';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    private readonly taskService: TasksService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTaskCommand) {
    const task = await this.taskService.create(command.taskData);
    this.eventBus.publish(new TaskCreatedEvent(task));
    return task;
  }
}
