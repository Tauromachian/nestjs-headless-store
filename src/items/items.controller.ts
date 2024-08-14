import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ResponseItemDto } from './dto/response-item.dto';
import { ResponseCategoryDto } from 'src/categories/dto/response-category.dto';

import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { Paginate } from 'src/pagination/decorator/pagination.decorator';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created.',
    type: ResponseItemDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all items' })
  @ApiResponse({
    status: 200,
    description: 'Return all items.',
    type: [ResponseCategoryDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(@Paginate() paginationDto: QueryPaginationDto) {
    return this.itemsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an item by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the item' })
  @ApiResponse({
    status: 200,
    description: 'Return the item with the specified ID.',
    type: ResponseCategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an item by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the item' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully updated.',
    type: ResponseCategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the item' })
  @ApiResponse({
    status: 204,
    description: 'The item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
