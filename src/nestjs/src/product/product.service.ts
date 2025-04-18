import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateProductDto } from './create-product.dto.ts';

async function mockSave(createProductDto: CreateProductDto) {
  return createProductDto;
}

@Injectable()
export class ProductService {
  private products: CreateProductDto[] = [];

  async create(createProductDto: CreateProductDto) {
    const product = await mockSave(createProductDto)
    if (!product) {
      throw new HttpException('创建失败，请稍后重试', HttpStatus.EXPECTATION_FAILED)
    }
    this.products.push(createProductDto);
    return createProductDto;
  }

  update(id: number, updateProductDto: CreateProductDto) {
    if (id >= 0 && id < this.products.length) {
      this.products[id] = updateProductDto;
      return updateProductDto;
    }
    return null;
  }

  findAll() {
    return this.products;
  }
}
