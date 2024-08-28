import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Session } from './entities/session.entity';
import { SessionDto } from './dto/session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
  ) {}

  create(SessionDto: SessionDto): Promise<Session> {
    const session = this.sessionsRepository.create(SessionDto);

    return this.sessionsRepository.save(session);
  }

  async findByUserId(userId: number): Promise<Session[]> {
    const sessions = await this.sessionsRepository.findBy({ userId });

    return sessions;
  }

  async findOne(id: number): Promise<Session> {
    const session = await this.sessionsRepository.findOne({ where: { id } });

    if (!session) throw new NotFoundException();

    return session;
  }

  async update(id: number, updateSessionDto: SessionDto): Promise<Session> {
    const updateResult = await this.sessionsRepository.update(
      id,
      updateSessionDto,
    );

    if (updateResult.affected === 0) throw new NotFoundException();

    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.sessionsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'Session removed successfully' };
  }
}
