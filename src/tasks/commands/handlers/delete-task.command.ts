import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';
import {DeleteTaskCommand} from '../impl/delete-task.command';
import {TasksService} from '../../tasks.service';
import {TaskDeletedEvent} from 'src/tasks/events/task-deleted.event';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    private readonly tasksService: TasksService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteTaskCommand) {
    const result = await this.tasksService.remove(command.id);
    this.eventBus.publish(new TaskDeletedEvent(command.id));
    return result;
  }
}
