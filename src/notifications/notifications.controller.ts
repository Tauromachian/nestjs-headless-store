import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';
import { Filter } from 'src/filters/decorators/filter.decorator';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { QueryFilterDto } from 'src/filters/dto/query-filters.dto';
import { Observable } from 'rxjs';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'The notification has been successfully created.',
    type: CreateNotificationDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all notifications' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications',
    type: [CreateNotificationDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(@Filter() filterDto: QueryFilterDto) {
    return this.notificationsService.findAll(filterDto);
  }

  @Public()
  @Sse('sse')
  sse(): Observable<any> {
    return this.notificationsService.getNotificationStream();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single notification by ID' })
  @ApiParam({ name: 'id', description: 'ID of the notification to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'The notification details',
    type: CreateNotificationDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing notification by ID' })
  @ApiParam({ name: 'id', description: 'ID of the notification to update' })
  @ApiResponse({
    status: 200,
    description: 'The updated notification',
    type: UpdateNotificationDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification by ID' })
  @ApiParam({ name: 'id', description: 'ID of the notification to delete' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
