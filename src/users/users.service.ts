import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '@/database/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { RolesService } from '@/roles/roles.service'

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    )

    const username = await this.findByUsername(createUserDto.username)
    if (username) {
      throw new NotAcceptableException('Username already exists')
    }

    const email = await this.findByEmail(createUserDto.email)
    if (email) {
      throw new NotAcceptableException('Email already exists')
    }

    const phone = await this.findByPhone(createUserDto.phone)
    if (phone) {
      throw new NotAcceptableException('Phone already exists')
    }

    const role = await this.findRole(createUserDto.roleId)
    if (!role) {
      throw new NotFoundException('Role not found')
    }

    delete createUserDto.password
    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        passwordHash: hashedPassword,
      },
    })

    delete newUser.passwordHash

    return newUser
  }

  async findAll() {
    const users = await this.prismaService.user.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    users.forEach(user => {
      delete user.passwordHash
    })
    return users
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
      })
      delete user.passwordHash
      return user
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found')
      }
      throw new NotAcceptableException(error.message)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const username = await this.findByUsername(updateUserDto.username)
      if (username) {
        throw new NotAcceptableException('Username already exists')
      }
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const email = await this.findByEmail(updateUserDto.email)
      if (email) {
        throw new NotAcceptableException('Email already exists')
      }
    }

    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const phone = await this.findByPhone(updateUserDto.phone)
      if (phone) {
        throw new NotAcceptableException('Phone already exists')
      }
    }

    if (updateUserDto.roleId && updateUserDto.roleId !== user.roleId) {
      const role = await this.findRole(updateUserDto.roleId)
      if (!role) {
        throw new NotFoundException('Role not found')
      }
    }

    const updatedUser = {
      name: updateUserDto?.name,
      username: updateUserDto?.username,
      email: updateUserDto?.email ?? user.email,
      phone: updateUserDto?.phone ?? user.phone,
      roleId: updateUserDto?.roleId ?? user.roleId,
    }

    try {
      const user = await this.prismaService.user.update({
        where: {
          id,
        },
        data: updatedUser,
      })

      delete user.passwordHash
      return user
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found')
      }
      throw new NotAcceptableException(error.message)
    }
  }
  async remove(id: string) {
    try {
      await this.prismaService.user.delete({
        where: {
          id,
        },
      })
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found')
      }
      throw new NotAcceptableException(error.message)
    }
  }

  async findByUsername(data: string) {
    return await this.prismaService.user.findUnique({
      where: {
        username: data,
      },
    })
  }

  async findByEmail(data: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email: data,
      },
    })
  }

  async findByPhone(data: string) {
    return await this.prismaService.user.findUnique({
      where: {
        phone: data,
      },
    })
  }

  async findRole(data: string) {
    return await this.rolesService.findOne(data)
  }
}
