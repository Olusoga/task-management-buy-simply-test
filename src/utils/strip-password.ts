import {User} from 'src/user/entities/user.entity';

export function stripPasswordOnly(user: User): Omit<User, 'password'> {
  const cleanedUser = Object.create(
    Object.getPrototypeOf(user),
    Object.getOwnPropertyDescriptors(user),
  );
  delete cleanedUser.password;
  return cleanedUser;
}
