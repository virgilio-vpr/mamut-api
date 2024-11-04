import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ParseIntPipe, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
    }),

    // new ParseIntPipe() // Se isso estiver ativado vai dar erro na requisição
  )

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
