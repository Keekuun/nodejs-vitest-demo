import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE, APP_FILTER } from '@nestjs/core';

import { HttpExceptionsFilter } from '@/nestjs/src/common/http-exception.filter.ts';
import { LoggerModule } from '@/nestjs/src/common/logger/logger.module.ts';


import { UserController } from '@/nestjs/src/user/user.controller.ts';
import { ProductModule } from '@/nestjs/src/product/product.module.ts';

const validationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
};

@Module({
    imports: [LoggerModule, ProductModule],
    controllers: [UserController], // 注册 UsersController
    providers: [
    {
        provide: APP_FILTER,
        useClass: HttpExceptionsFilter,
      },
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe(validationPipeOptions), // 使用 useValue 提供实例
        },
    ],
})
export class AppModule {}
