import { IsNotEmpty, IsString } from 'class-validator'

export class LoginRequestBody {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string
}
