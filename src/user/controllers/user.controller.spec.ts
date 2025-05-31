import {Test, TestingModule} from '@nestjs/testing';
import {UserController} from '../controllers/user.controller';
import {UserService} from '../services/user.service';
import {UserRole} from '../entities/user.entity';
import {SignupDto} from '../dto/signup.dto';
import {UpdateUserDto} from '../dto/update-user.dto';

describe('UserController (unit)', () => {
  let controller: UserController;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{provide: UserService, useValue: userService}],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const mockUsers = [{id: '1', email: 'a@b.com'}];
      userService.findAll?.mockResolvedValue(mockUsers);

      const req = {user: {id: 'admin-id', role: UserRole.ADMIN}, message: ''};

      const result = await controller.findAll(req);

      expect(userService.findAll).toHaveBeenCalled();
      expect(req.message).toBe('Users retrieved successfully');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return current user profile', async () => {
      const user = {id: '123', email: 'user@example.com'};
      userService.findOne?.mockResolvedValue(user);

      const req = {user: {id: '123'}, message: ''};

      const result = await controller.findOne(req);

      expect(userService.findOne).toHaveBeenCalledWith('123');
      expect(req.message).toBe('User profile retrieved successfully');
      expect(result).toEqual(user);
    });
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const dto: SignupDto = {
        email: 'newuser@example.com',
        password: 'pass123',
        firstName: 'New',
        lastName: 'User',
        role: UserRole.USER,
      };
      const createdUser = {id: 'newid', email: dto.email};
      userService.createUser?.mockResolvedValue(createdUser);

      const req = {user: {id: 'admin-id', role: UserRole.ADMIN}, message: ''};

      const result = await controller.signup(dto, req);

      expect(userService.createUser).toHaveBeenCalledWith(dto);
      expect(req.message).toBe('User created successfully');
      expect(result).toEqual(createdUser);
    });
  });

  describe('updateUser', () => {
    it('should update user profile for self', async () => {
      const updateDto: UpdateUserDto = {firstName: 'Updated', lastName: 'Name'};
      const updatedUser = {
        id: 'user-123',
        firstName: 'Updated',
        lastName: 'Name',
      };
      userService.updateUser?.mockResolvedValue(updatedUser);

      const req = {user: {id: 'user-123'}, message: ''};

      const result = await controller.updateUser('user-123', updateDto, req);

      expect(userService.updateUser).toHaveBeenCalledWith(
        'user-123',
        updateDto,
        'user-123',
      );
      expect(req.message).toBe('User updated successfully');
      expect(result).toEqual(updatedUser);
    });

    it('should pass correct params even if user tries updating other user (guard should handle rejection)', async () => {
      const updateDto: UpdateUserDto = {firstName: 'Fail', lastName: 'Test'};
      const updatedUser = {
        id: 'other-user',
        firstName: 'Fail',
        lastName: 'Test',
      };
      userService.updateUser?.mockResolvedValue(updatedUser);

      const req = {user: {id: 'user-123'}, message: ''};

      const result = await controller.updateUser('other-user', updateDto, req);

      expect(userService.updateUser).toHaveBeenCalledWith(
        'other-user',
        updateDto,
        'user-123',
      );
      expect(req.message).toBe('User updated successfully');
      expect(result).toEqual(updatedUser);
    });
  });
});
