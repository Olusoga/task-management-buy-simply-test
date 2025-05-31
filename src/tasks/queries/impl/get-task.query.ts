import {FilterTasksDto} from 'src/tasks/dto/filter-task.dto';
export class GetTasksQuery {
  constructor(public readonly filter: FilterTasksDto) {}
}
