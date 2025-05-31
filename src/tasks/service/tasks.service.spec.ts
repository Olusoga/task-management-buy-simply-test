import {Test, TestingModule} from '@nestjs/testing';
import {TasksService} from './tasks.service';
import {UserService} from 'src/user/services/user.service';
import {LoggingService} from 'src/logging/logging.service';
import {Repository} from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {Task} from '../entities/task.entity';

describe('TasksService (unit)', () => {
  let service: TasksService;
  let taskRepo: Partial<Record<keyof Repository<Task>, jest.Mock>>;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let logger: Partial<Record<keyof LoggingService, jest.Mock>>;

  beforeEach(async () => {
    taskRepo = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    userService = {
      findOne: jest.fn(),
    };

    logger = {
      error: jest.fn(),
    };
    const mockQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    taskRepo.createQueryBuilder?.mockReturnValue(mockQueryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {provide: 'TaskRepository', useValue: taskRepo},
        {provide: UserService, useValue: userService},
        {provide: LoggingService, useValue: logger},
      ],
    })
      .overrideProvider('TaskRepository')
      .useValue(taskRepo)
      .compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should create and save a task with assigned user', async () => {
      const createDto = {title: 'Test task', assignedTo: 'user-id'};
      const foundUser = {id: 'user-id', email: 'u@example.com'};
      const taskEntity = {
        id: 'task-id',
        title: 'Test task',
        assignedTo: foundUser,
      };

      (userService.findOne as jest.Mock).mockResolvedValue(foundUser);
      taskRepo.create?.mockReturnValue(taskEntity);
      taskRepo.save?.mockResolvedValue(taskEntity);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await service.create(createDto as any);

      expect(userService.findOne).toHaveBeenCalledWith('user-id');
      expect(taskRepo.create).toHaveBeenCalledWith({
        title: 'Test task',
        assignedTo: foundUser,
      });
      expect(taskRepo.save).toHaveBeenCalledWith(taskEntity);
      expect(result).toEqual(taskEntity);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      (userService.findOne as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(
        service.create({
          title: 'task',
          assignedTo: 'user-id',
          description: '',
          createdBy: '',
        }),
      ).rejects.toThrow(InternalServerErrorException);

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to create task',
        expect.any(String),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const filter = {page: 1, limit: 2, status: 'open', priority: 'high'};
      const mockQueryBuilder = taskRepo.createQueryBuilder!();
      const tasks = [{id: 't1'}, {id: 't2'}];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([tasks, 5]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await service.findAll(filter as any);

      expect(taskRepo.createQueryBuilder).toHaveBeenCalledWith('task');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.status = :status',
        {status: 'open'},
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.priority = :priority',
        {priority: 'high'},
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(2);

      expect(result).toEqual({
        data: tasks,
        total: 5,
        page: 1,
        limit: 2,
        prevPage: null,
        nextPage: 2,
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      const mockQueryBuilder = taskRepo.createQueryBuilder?.();
      mockQueryBuilder.getManyAndCount.mockRejectedValue(
        new Error('DB failure'),
      );

      await expect(service.findAll({page: 1, limit: 2})).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to retrieve tasks',
        expect.any(String),
      );
    });
  });

  describe('findOneById', () => {
    it('should return task if found and assigned to current user', async () => {
      const task = {id: 'task-id', assignedTo: {id: 'user-id'}};
      const mockQueryBuilder = taskRepo.createQueryBuilder!();
      mockQueryBuilder.getOne.mockResolvedValue(task);

      const result = await service.findOneById('task-id', 'user-id');

      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if no task or not assigned to user', async () => {
      const mockQueryBuilder = taskRepo.createQueryBuilder?.();
      mockQueryBuilder.getOne.mockResolvedValue(undefined);

      await expect(service.findOneById('task-id', 'user-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const mockQueryBuilder = taskRepo.createQueryBuilder?.();
      mockQueryBuilder.getOne.mockRejectedValue(new Error('DB error'));

      await expect(service.findOneById('task-id', 'user-id')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to find task by id'),
        expect.any(String),
      );
    });
  });

  describe('update', () => {
    it('should update and return task if user authorized', async () => {
      const existingTask = {
        id: 'task-id',
        assignedTo: {id: 'user-id', email: 'u@example.com'},
        updatedAt: new Date(),
      };
      const updateDto = {title: 'Updated title'};
      const savedTask = {...existingTask, ...updateDto, updatedAt: new Date()};

      taskRepo.findOne?.mockResolvedValue(existingTask);
      taskRepo.save?.mockResolvedValue(savedTask);

      const result = await service.update('task-id', updateDto, 'user-id');

      expect(taskRepo.findOne).toHaveBeenCalledWith({
        where: {id: 'task-id'},
        relations: ['assignedTo'],
      });
      expect(taskRepo.save).toHaveBeenCalled();
      expect(result.assignedTo).toEqual({
        id: existingTask.assignedTo.id,
        email: existingTask.assignedTo.email,
      });
      expect(result.title).toEqual(updateDto.title);
    });

    it('should throw NotFoundException if task not found', async () => {
      taskRepo.findOne?.mockResolvedValue(null);

      await expect(service.update('task-id', {}, 'user-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if user not assigned to task', async () => {
      const task = {id: 'task-id', assignedTo: {id: 'other-user'}};
      taskRepo.findOne?.mockResolvedValue(task);

      await expect(service.update('task-id', {}, 'user-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      taskRepo.findOne?.mockRejectedValue(new Error('DB error'));

      await expect(service.update('task-id', {}, 'user-id')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to update task'),
        expect.any(String),
      );
    });
  });

  describe('remove', () => {
    it('should remove task if found', async () => {
      const task = {id: 'task-id'};
      taskRepo.findOne?.mockResolvedValue(task);
      taskRepo.remove?.mockResolvedValue(undefined);

      await service.remove('task-id');

      expect(taskRepo.findOne).toHaveBeenCalledWith({where: {id: 'task-id'}});
      expect(taskRepo.remove).toHaveBeenCalledWith(task);
    });

    it('should throw NotFoundException if task not found', async () => {
      taskRepo.findOne?.mockResolvedValue(null);

      await expect(service.remove('task-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      taskRepo.findOne?.mockRejectedValue(new Error('DB error'));

      await expect(service.remove('task-id')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to remove task'),
        expect.any(String),
      );
    });
  });
});
