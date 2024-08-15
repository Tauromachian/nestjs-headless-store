import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dto';
import { ResponsePaginationDto } from 'src/pagination/dto/response-pagination.dto';
import { ResponseCategoryDto } from 'src/categories/dto/response-category.dto';
import { QueryPaginationDto } from 'src/pagination/dto/query-pagination.dto';
import { Paginate } from 'src/pagination/decorator/pagination.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 409, description: 'Conflict. Email already exists.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [ResponsePaginationDto<ResponseCategoryDto>],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(@Paginate() paginationDto: QueryPaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':email')
  @ApiOperation({ summary: 'Retrieve a user by email' })
  @ApiParam({ name: 'email', description: 'The email of the user' })
  @ApiResponse({
    status: 200,
    description: 'The user with the specified email',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
