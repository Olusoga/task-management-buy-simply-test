import {Injectable} from '@nestjs/common';
import {SignupDto} from 'src/user/dto/signup.dto';
import {User} from 'src/user/entities/user.entity';
import {UserService} from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(signupDto: SignupDto): Promise<Omit<User, 'password'>> {
    const user = await this.userService.createUser(signupDto);
    const {password, ...userWithoutPassword} = user;
    return Object.assign(
      Object.create(Object.getPrototypeOf(user)),
      userWithoutPassword,
    );
  }
}
