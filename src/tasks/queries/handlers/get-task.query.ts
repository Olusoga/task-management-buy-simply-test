import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {FilterTasksDto} from 'src/tasks/dto/filter-task.dto';
import {TasksService} from 'src/tasks/service/tasks.service';
import {GetTasksQuery} from '../impl/get-task.query';

@QueryHandler(GetTasksQuery)
export class GetTasksHandler implements IQueryHandler<GetTasksQuery> {
  constructor(private readonly tasksService: TasksService) {}

  async execute(query: GetTasksQuery) {
    const filter: FilterTasksDto = query.filter;
    return this.tasksService.findAll(filter);
  }
}
