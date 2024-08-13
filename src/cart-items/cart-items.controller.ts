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

import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';
import { ResponseCartItemDto } from './dto/response-cart-item.dto';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart item' })
  @ApiResponse({
    status: 201,
    description: 'The cart item has been successfully created.',
    type: ResponseCartItemDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemsService.create(createCartItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all cart items' })
  @ApiResponse({
    status: 200,
    description: 'Return all cart items.',
    type: [ResponseCartItemDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll() {
    return this.cartItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a cart item by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cart item' })
  @ApiResponse({
    status: 200,
    description: 'Return the cart item with the specified ID.',
    type: ResponseCartItemDto,
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  findOne(@Param('id') id: string) {
    return this.cartItemsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Retrieve a cart item by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cart item' })
  @ApiResponse({
    status: 200,
    description: 'Return the cart item with the specified ID.',
    type: ResponseCartItemDto,
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemsService.update(+id, updateCartItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartItemsService.remove(+id);
  }
}
