import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {FilterTasksDto} from './dto/filter-task.dto';
import {Task} from './entities/task.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserService} from 'src/user/user.service';
import {LoggingService} from 'src/logging/logging.service';
import {User} from 'src/user/entities/user.entity';

type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  prevPage?: number | null;
  nextPage?: number | null;
};

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly usersService: UserService,
    private readonly logger: LoggingService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const {assignedTo, ...rest} = createTaskDto as any;
      let assignedUser: User | undefined = undefined;

      if (assignedTo) {
        const foundUser = await this.usersService.findOne(assignedTo);
        if (!foundUser) {
          throw new NotFoundException(`User with ID ${assignedTo} not found`);
        }
        assignedUser = foundUser;
      }

      const task = this.taskRepo.create({
        ...rest,
        assignedTo: assignedUser,
      });

      return await this.taskRepo.save(task);
    } catch (error) {
      this.logger.error('Failed to create task', error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the task',
      );
    }
  }

  async findAll(filter: FilterTasksDto): Promise<Paginated<Task>> {
    try {
      const {page, limit, status, priority} = filter;

      const query = this.taskRepo.createQueryBuilder('task');

      if (status) query.andWhere('task.status = :status', {status});
      if (priority) query.andWhere('task.priority = :priority', {priority});

      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const totalPages = Math.ceil(total / limit);

      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;

      return {data, total, page, limit, prevPage, nextPage};
    } catch (error) {
      this.logger.error('Failed to retrieve tasks', error.stack);
      throw new InternalServerErrorException(
        'An error occurred while retrieving tasks',
      );
    }
  }

  async findOneById(id: string, currentUserId: string) {
    try {
      const task = await this.taskRepo
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.assignedTo', 'user')
        .where('task.id = :id', {id})
        .andWhere('task.assignedTo = :currentUserId', {currentUserId})
        .select(['task', 'user.id', 'user.email'])
        .getOne();

      if (!task) {
        throw new NotFoundException(
          `Task with ID ${id} not found or access denied`,
        );
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find task by id: ${id}`, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while retrieving the task',
      );
    }
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    currentUserId: string,
  ): Promise<Task> {
    try {
      const task = await this.taskRepo.findOne({
        where: {id},
        relations: ['assignedTo'],
      });

      if (!task) {
        throw new NotFoundException(`Task with ID "${id}" not found`);
      }
      if (task.assignedTo?.id !== currentUserId) {
        throw new UnauthorizedException(
          'You are not authorized to update this task',
        );
      }

      Object.assign(task, updateTaskDto);
      task.updatedAt = new Date();
      const updatedTask = await this.taskRepo.save(task);

      if (updatedTask.assignedTo) {
        updatedTask.assignedTo = {
          id: updatedTask.assignedTo.id,
          email: updatedTask.assignedTo.email,
        } as User;
      }

      return updatedTask;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      this.logger.error(`Failed to update task with id: ${id}`, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while updating the task',
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const task = await this.taskRepo.findOne({where: {id}});

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      await this.taskRepo.remove(task);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to remove task with id: ${id}`, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while deleting the task',
      );
    }
  }
}
