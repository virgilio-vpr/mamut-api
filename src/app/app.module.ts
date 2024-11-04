import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from '../database/database.module'
import { PrismaService } from '../database/prisma/prisma.service'
import { UsersModule } from '../users/users.module'
import { RolesModule } from '../roles/roles.module'
import { HttpExceptionFilter } from '@/shared/filters/http-exception.filter'
import { AuthModule } from '@/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'

@Module({
  imports: [DatabaseModule, UsersModule, RolesModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    HttpExceptionFilter,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
