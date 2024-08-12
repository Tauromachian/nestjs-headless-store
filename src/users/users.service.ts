import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';

import { SALT_ROUNDS } from './constants';
import { dbErrorCodes } from 'src/database/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User({
      ...createUserDto,
      password: await hash(createUserDto.password, SALT_ROUNDS),
    });

    let newUser: User;

    try {
      newUser = await this.usersRepository.save(user);
    } catch (error) {
      if (!(error instanceof QueryFailedError)) {
        throw new InternalServerErrorException('Unexpected error ocurred');
      }

      if (error.driverError.code === dbErrorCodes.UNIQUE_VIOLATION) {
        throw new ConflictException('Email already exists');
      }
    }

    delete newUser.password;

    return newUser;
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException();

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const result = await this.usersRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'User deleted successfully' };
  }
}
