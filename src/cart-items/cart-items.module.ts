import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';

import { IsInDatabaseConstraint } from 'src/custom-validators/IsInDatabase';

import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  controllers: [CartItemsController],
  providers: [CartItemsService, IsInDatabaseConstraint],
})
export class CartItemsModule {}
