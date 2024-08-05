import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User(createUserDto);

    const newUser = await this.entityManager.save(user);

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
