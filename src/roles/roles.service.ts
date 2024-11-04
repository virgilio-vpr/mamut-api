import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { PrismaService } from '@/database/prisma/prisma.service'

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}
  async create(createRoleDto: CreateRoleDto) {
    try {
      return await this.prismaService.role.create({
        data: {
          name: createRoleDto.name,
        },
      })
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Role already exists')
      }

      throw new NotAcceptableException(error.message)
    }
  }

  async findAll() {
    const roles = await this.prismaService.role.findMany({
      orderBy: {
        name: 'desc',
      },
    })
    return roles
  }

  async findOne(id: string) {
    const role = await this.prismaService.role.findUnique({
      where: {
        id,
      },
    })

    if (!role) {
      throw new NotFoundException('Role not found')
    }

    return role
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const dataRole = {
      name: updateRoleDto.name,
    }
    try {
      return await this.prismaService.role.update({
        where: {
          id,
        },
        data: dataRole,
      })
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Role not found')
      }

      throw new NotAcceptableException(error.message)
    }
  }

  remove(id: string) {
    const role = this.prismaService.role.findUnique({
      where: {
        id,
      },
    })

    if (!role) {
      throw new NotFoundException('Role not found')
    }

    return this.prismaService.role.delete({
      where: {
        id,
      },
    })
  }
}
