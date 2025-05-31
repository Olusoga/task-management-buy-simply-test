import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {SignupDto} from '../dto/signup.dto';
import {User} from '../entities/user.entity';
import {stripPasswordOnly} from 'src/utils/strip-password';
import {LoggingService} from 'src/logging/logging.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: LoggingService,
  ) {}

  async createUser(signupDto: SignupDto) {
    try {
      const {email, password, ...rest} = signupDto;

      const existingUser = await this.userRepository.findOne({where: {email}});
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const user = this.userRepository.create({
        email,
        password,
        ...rest,
      });

      const userData = await this.userRepository.save(user);
      return stripPasswordOnly(userData);
    } catch (error) {
      this.logger.error(
        `Failed to create user with email ${signupDto.email}`,
        error.stack,
      );
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({where: {email}});
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${email}`, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while retrieving the user by email',
      );
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.email',
          'user.firstName',
          'user.lastName',
          'user.role',
          'user.isActive',
          'user.createdAt',
          'user.updatedAt',
        ])
        .getMany();
    } catch (error) {
      this.logger.error('Failed to retrieve all users', error.stack);
      throw new InternalServerErrorException(
        'An error occurred while retrieving users',
      );
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({where: {id}});
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find user by id: ${id}`, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while retrieving the user',
      );
    }
  }

  async updateUser(
    id: string,
    updateData: Partial<Omit<SignupDto, 'email' | 'password'>>,
    currentUserId: string,
  ) {
    try {
      if (id !== currentUserId) {
        throw new UnauthorizedException('You can only update your own profile');
      }

      const user = await this.userRepository.findOne({where: {id}});
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      Object.assign(user, updateData);
      user.updatedAt = new Date();

      const updatedUser = await this.userRepository.save(user);
      return stripPasswordOnly(updatedUser);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      this.logger.error(`Failed to update user with id: ${id}`, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while updating the user',
      );
    }
  }
}
