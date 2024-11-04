import { UsersService } from '@/users/users.service'
import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UnauthorizedError } from './errors/unauthorized.error'
import { User } from '@/users/entities/user.entity'
import { UserPayload } from './models/UserPayload'
import { JwtService } from '@nestjs/jwt'
import { UserToken } from './models/userToken'
import { PrismaService } from '@/database/prisma/prisma.service'

@Injectable()
export class AuthService {
  userService: any
  constructor(
    private userSevice: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {
    console.log('UserService:', this.userService)
  }

  async login(user: User): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      name: user.name,
      username: user.username,
      roleId: user.roleId,
    }

    const jwtToken = this.jwtService.sign(payload)

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        access_last: new Date(),
      },
    })

    return {
      access_token: jwtToken,
    }
  }

  async validateUser(username: string, password: string) {
    const user = await this.userSevice.findByUsername(username)

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
      if (isPasswordValid) {
        return {
          ...user,
          passwordHash: undefined,
        }
      }
    }

    throw new UnauthorizedError('Username or password provided is incorrect.')
  }
}
