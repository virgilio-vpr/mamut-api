import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { MasterUserGuard } from '../shared/guards/route-permission.guard'
import { Role } from './decorators/role.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Role('master')
  @UseGuards(MasterUserGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Role('master', 'self')
  @UseGuards(MasterUserGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Role('master')
  @UseGuards(MasterUserGuard)
  @Delete(':id')
  @UseGuards(MasterUserGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}
