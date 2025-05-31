import {Test, TestingModule} from '@nestjs/testing';
import {TasksController} from './tasks.controller';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {CreateTaskDto} from '../dto/create-task.dto';
import {UpdateTaskDto} from '../dto/update-task.dto';
import {FilterTasksDto} from '../dto/filter-task.dto';
import {GetTasksQuery} from '../queries/impl/get-task.query';
import {GetTaskByIdQuery} from '../queries/impl/get-task-by-id.query';
import {CreateTaskCommand} from '../commands/impl/create-task.command';
import {UpdateTaskCommand} from '../commands/impl/updates-task.command';
import {DeleteTaskCommand} from '../commands/impl/delete-task.command';

describe('TasksController', () => {
  let controller: TasksController;
  let commandBus: {execute: jest.Mock};
  let queryBus: {execute: jest.Mock};

  beforeEach(async () => {
    commandBus = {execute: jest.fn()};
    queryBus = {execute: jest.fn()};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {provide: CommandBus, useValue: commandBus},
        {provide: QueryBus, useValue: queryBus},
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  describe('getTasks', () => {
    it('should execute GetTasksQuery and set req.message', async () => {
      const filter: FilterTasksDto = {page: 1, limit: 10};
      const req = {user: {id: 'user-id'}, message: undefined};
      const expectedResult = ['task1', 'task2'];

      queryBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.getTasks(filter, req);

      expect(queryBus.execute).toHaveBeenCalledWith(new GetTasksQuery(filter));
      expect(req.message).toBe('Tasks retrieved successfully');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getTaskById', () => {
    it('should execute GetTaskByIdQuery and set req.message', async () => {
      const req = {user: {id: 'user-id'}, message: undefined};
      const taskId = 'task-id';
      const expectedResult = {id: taskId, title: 'Task'};

      queryBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.getTaskById(taskId, req);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetTaskByIdQuery(taskId, 'user-id'),
      );
      expect(req.message).toBe('Task retrieved successfully');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should execute CreateTaskCommand and set req.message', async () => {
      const createDto: CreateTaskDto = {
        title: 'New task',
        description: '',
        assignedTo: '',
        createdBy: '',
      };
      const req = {user: {id: 'user-id'}, message: undefined};
      const expectedResult = {id: 'task-id', title: 'New task'};

      commandBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, req);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateTaskCommand(createDto),
      );
      expect(req.message).toBe('Task created successfully');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should execute UpdateTaskCommand and set req.message', async () => {
      const updateDto: UpdateTaskDto = {title: 'Updated title'};
      const taskId = 'task-id';
      const req = {user: {id: 'user-id'}, message: undefined};
      const expectedResult = {id: taskId, title: 'Updated title'};

      commandBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.update(taskId, updateDto, req);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateTaskCommand(taskId, updateDto, 'user-id'),
      );
      expect(req.message).toBe('Task updated successfully');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should execute DeleteTaskCommand and set req.message', async () => {
      const taskId = 'task-id';
      const req = {user: {id: 'user-id'}, message: undefined};
      const expectedResult = undefined;

      commandBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.remove(taskId, req);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeleteTaskCommand(taskId),
      );
      expect(req.message).toBe('Task deleted successfully');
      expect(result).toBe(expectedResult);
    });
  });
});
