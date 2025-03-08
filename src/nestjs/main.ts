import { NestFactory } from "@nestjs/core"
import {AppModule} from "./app.module";


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3001)
    .then(() => {
      console.log("Server is running on port 3001")
    })
    .catch((err: any) => {
      console.error("Error starting server:", err)
    })
}

bootstrap()