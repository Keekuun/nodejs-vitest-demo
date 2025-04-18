import {Controller, Post, Body, HttpException, HttpStatus} from '@nestjs/common';
import { CreateProductDto } from './create-product.dto.ts';
import {ProductService} from "./product.service.ts";

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('create')
  async create(@Body() createProductDto: CreateProductDto) {
    // // 处理创建product逻辑
    // return this.productService.create(createProductDto);
    const product = await mockSave(createProductDto)
    if (!product) {
      throw new HttpException('创建失败，请稍后重试', HttpStatus.EXPECTATION_FAILED)
    }
    return createProductDto;
  }
}

async function mockSave(createProductDto: CreateProductDto) {
  return createProductDto;
}
