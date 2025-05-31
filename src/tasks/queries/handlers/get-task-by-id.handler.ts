import {QueryHandler, IQueryHandler} from '@nestjs/cqrs';
import {TasksService} from 'src/tasks/tasks.service';
import {GetTaskByIdQuery} from '../impl/get-task-by-id.query';

@QueryHandler(GetTaskByIdQuery)
export class GetTaskByIdHandler implements IQueryHandler<GetTaskByIdQuery> {
  constructor(private readonly tasksService: TasksService) {}

  async execute(query: GetTaskByIdQuery) {
    return this.tasksService.findOneById(query.id, query.currentUserId);
  }
}
