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
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { ResponsePaginationDto } from 'src/pagination/dto/response-pagination.dto';
import { paginate } from 'src/pagination/helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
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

  async findAll(
    paginationDto: QueryPaginationDto,
  ): Promise<ResponsePaginationDto<User>> {
    return paginate(this.usersRepository, paginationDto);
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
