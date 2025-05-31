import {CommandHandler, ICommandHandler, EventBus} from '@nestjs/cqrs';
import {TasksService} from '../../tasks.service';
import {TaskUpdatedEvent} from 'src/tasks/events/task-updated.event';
import {UpdateTaskCommand} from '../impl/updates-task.command';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    private readonly tasksService: TasksService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateTaskCommand) {
    const {id, updates, currentUserId} = command;

    const updatedTask = await this.tasksService.update(
      id,
      updates,
      currentUserId,
    );

    this.eventBus.publish(new TaskUpdatedEvent(updatedTask.id, updates));
    return updatedTask;
  }
}
