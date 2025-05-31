import {Injectable, ConflictException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {SignupDto} from './dto/signup.dto';
import {User} from './entities/user.entity';
import {stripPasswordOnly} from 'src/utils/strip-password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(signupDto: SignupDto) {
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
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({where: {email}});
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.userRepository
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
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({where: {id}});
  }
}
