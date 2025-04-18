import { NestFactory } from "@nestjs/core"
import {AppModule} from "./app.module.ts";
import {ValidationPipe} from "@nestjs/common";
import { Logger } from '@/nestjs/src/common/logger/logger.ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3001)
    .then(() => {
      console.log("Server is running on port 3001")
    })
    .catch((err: any) => {
      console.error("Error starting server:", err)
    })
}

bootstrap()
