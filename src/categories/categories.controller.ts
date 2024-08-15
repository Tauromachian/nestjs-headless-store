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

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { ResponsePaginationDto } from 'src/pagination/dto/response-pagination.dto';
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { Paginate } from 'src/pagination/decorator/pagination.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: ResponseCategoryDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories.',
    type: [ResponsePaginationDto<ResponseCategoryDto>],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(@Paginate() paginationDto: QueryPaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a category by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the category' })
  @ApiResponse({
    status: 200,
    description: 'Return the category with the specified ID.',
    type: ResponseCategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    type: ResponseCategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the category' })
  @ApiResponse({
    status: 204,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
