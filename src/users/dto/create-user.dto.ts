import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsUUID,
  // Matches,
  MaxLength,
  MinLength,
} from 'class-validator'
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password too weak',
  // })
  password: string

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  username: string

  @IsNotEmpty()
  @IsMobilePhone('pt-BR')
  @IsString()
  phone: string

  @IsNotEmpty()
  @IsUUID()
  roleId: string
}
