// src/users/guards/master-user.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RolesService } from '../../roles/roles.service'

@Injectable()
export class MasterUserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())

    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    const userRole = await this.rolesService.findOne(user.roleId)

    if (!userRole) {
      throw new UnauthorizedException("Anauthorized. User's role not found")
    }

    let havePermission: boolean = false
    roles.forEach(role => {
      if (
        role === userRole.name ||
        (role === 'self' && user.id === request.params.id)
      ) {
        havePermission = true
      }
    })

    if (!havePermission) {
      throw new UnauthorizedException(
        "Anauthorized. User don't have permission",
      )
    }

    return true
  }
}
