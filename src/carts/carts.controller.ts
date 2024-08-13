import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { ResponseCartDto } from './dto/response-cart.dto';

@ApiTags('carts') // Group your routes under the 'carts' tag in Swagger
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiResponse({
    status: 201,
    description: 'The cart has been successfully created.',
    type: ResponseCartDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all carts' })
  @ApiResponse({
    status: 200,
    description: 'Return all carts.',
    type: [ResponseCartDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(@Query('include') include: 'items' | undefined) {
    if (include === 'items') return this.cartsService.findAll(include);

    return this.cartsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cart' })
  @ApiResponse({
    status: 200,
    description: 'Return the cart.',
    type: ResponseCartDto,
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cart by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cart' })
  @ApiBody({ type: UpdateCartDto }) // Describe the body of the request
  @ApiResponse({
    status: 200,
    description: 'The cart has been successfully updated.',
    type: ResponseCartDto,
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(+id, updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cart by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cart' })
  @ApiResponse({
    status: 204,
    description: 'The cart has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }
}
