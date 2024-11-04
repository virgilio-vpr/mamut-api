import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { DatabaseModule } from '@/database/database.module'
import { RolesService } from '@/roles/roles.service'

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, RolesService],
  exports: [UsersService],
})
export class UsersModule {}
