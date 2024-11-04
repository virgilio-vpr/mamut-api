export interface UserPayload {
  sub: string
  name: string
  username: string
  roleId: string
  access_last?: Date
  iat?: number
  exp?: number
}
