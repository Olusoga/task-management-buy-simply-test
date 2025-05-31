import {Test, TestingModule} from '@nestjs/testing';
import {UserService} from './user.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {User} from '../entities/user.entity';
import {Repository} from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {SignupDto} from '../dto/signup.dto';
import {UserRole} from '../entities/user.entity';
import {LoggingService} from 'src/logging/logging.service';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }),
});

const mockLogger = () => ({
  error: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;
  let logger: LoggingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {provide: getRepositoryToken(User), useFactory: mockUserRepository},
        {provide: LoggingService, useFactory: mockLogger},
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    logger = module.get(LoggingService);
  });

  describe('createUser', () => {
    const signupDto: SignupDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      role: UserRole.USER,
      lastName: '',
    };

    it('should create a new user if email does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue({
        ...signupDto,
        id: '',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        hashPassword: function (): Promise<void> {
          throw new Error('Function not implemented.');
        },
      });
      userRepository.save.mockResolvedValue({
        ...signupDto,
        id: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        hashPassword: jest.fn(),
      } as unknown as User);

      const result = await service.createUser(signupDto);
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(signupDto.email);
    });

    it('should throw ConflictException if email exists', async () => {
      userRepository.findOne.mockResolvedValue({
        id: '1',
        ...signupDto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        hashPassword: jest.fn(),
      } as unknown as User);

      await expect(service.createUser(signupDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should log and throw InternalServerErrorException on unknown error', async () => {
      const error = new Error('Unexpected error');
      userRepository.findOne.mockRejectedValue(error);

      await expect(service.createUser(signupDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const user = {id: '1', email: 'test@example.com'} as User;
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(user);
    });

    it('should log and throw InternalServerErrorException on error', async () => {
      userRepository.findOne.mockRejectedValue(new Error('DB error'));
      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const users = [{id: '1', email: 'test@example.com'}];
      const queryBuilder = userRepository.createQueryBuilder();
      queryBuilder.getMany = jest.fn().mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });

    it('should log and throw InternalServerErrorException on error', async () => {
      const queryBuilder = userRepository.createQueryBuilder();
      queryBuilder.getMany = jest.fn().mockRejectedValue(new Error('Error'));
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = {id: '1'} as User;
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should log and throw InternalServerErrorException on error', async () => {
      userRepository.findOne.mockRejectedValue(new Error('Error'));
      await expect(service.findOne('1')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    const updateDto = {firstName: 'Updated'};

    it('should throw UnauthorizedException if currentUserId !== id', async () => {
      await expect(service.updateUser('1', updateDto, '2')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.updateUser('1', updateDto, '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update and return the user', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Updated',
        lastName: 'Doe',
        role: 'user',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as User;
      userRepository.findOne.mockResolvedValue({
        id: '1',
        firstName: 'Old',
      } as User);
      userRepository.save.mockResolvedValue(user);

      const result = await service.updateUser('1', updateDto, '1');
      expect(result).toHaveProperty('firstName', 'Updated');
    });

    it('should log and throw InternalServerErrorException on error', async () => {
      userRepository.findOne.mockResolvedValue({id: '1'} as User);
      userRepository.save.mockRejectedValue(new Error('Error'));

      await expect(service.updateUser('1', updateDto, '1')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
