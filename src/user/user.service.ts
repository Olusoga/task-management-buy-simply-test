import {Injectable, ConflictException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {SignupDto} from './dto/signup.dto';
import {User} from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(signupDto: SignupDto): Promise<User> {
    const {email, password, ...rest} = signupDto;

    const existingUser = await this.userRepository.findOne({where: {email}});
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      ...rest,
    });

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({where: {email}});
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOne({where: {id}});
  }
}
