import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto.ts';

@Controller('user')
export class UserController {
  @Post('register')
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    validateCustomDecorators: true,
    skipMissingProperties: false,
    forbidUnknownValues: true
  }))
  async register(@Body() createUserDto: CreateUserDto) {
    // 处理注册逻辑
    return { message: 'User registered successfully', data: createUserDto };
  }
}
