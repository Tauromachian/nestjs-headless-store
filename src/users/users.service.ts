import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly itemsRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  create(createUserDto: CreateUserDto) {
    const item = new User(createUserDto);

    const newUser = this.entityManager.save(item);

    return newUser;
  }

  async findAll() {
    return this.itemsRepository.find();
  }

  async findOne(id: number) {
    const item = await this.itemsRepository.findOne({ where: { id } });

    if (!item) throw new NotFoundException();

    return item;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.itemsRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const result = await this.itemsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'User deleted successfully' };
  }
}
