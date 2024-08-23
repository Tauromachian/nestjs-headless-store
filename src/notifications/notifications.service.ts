import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { filter } from 'src/filters/helpers';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ResponseNotificationDto } from './dto/response-notification.dto';
import { QueryFilterDto } from 'src/filters/dto/query-filters.dto';
import { ResponseFilterDto } from 'src/filters/dto/response-filters.dto';

import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<ResponseNotificationDto> {
    const notification = this.notificationsRepository.create(
      createNotificationDto,
    );

    const newNotification = this.notificationsRepository.save(notification);

    return newNotification;
  }

  async findAll(
    paginationDto: QueryFilterDto,
  ): Promise<ResponseFilterDto<Partial<ResponseNotificationDto>>> {
    return filter(this.notificationsRepository, paginationDto);
  }

  async findOne(id: number): Promise<ResponseNotificationDto> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });

    if (!notification) throw new NotFoundException();

    return notification;
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<ResponseNotificationDto> {
    const updateResult = await this.notificationsRepository.update(
      id,
      updateNotificationDto,
    );

    if (updateResult.affected === 0) throw new NotFoundException();

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.notificationsRepository.delete({ id });

    if (result.affected === 0) throw new NotFoundException();

    return { message: 'Notification deleted successfully' };
  }
}
