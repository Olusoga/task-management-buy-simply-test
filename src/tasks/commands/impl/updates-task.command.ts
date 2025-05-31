import {UpdateTaskDto} from '../../dto/update-task.dto';

export class UpdateTaskCommand {
  constructor(
    public readonly id: string,
    public readonly updates: UpdateTaskDto,
    public readonly currentUserId: string,
  ) {}
}
