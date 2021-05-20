import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RequestCreateUserDto {
  @IsNotEmpty({ message: 'Campo nome é obrigatório' })
  name: string;

  @IsNotEmpty({ message: 'Campo e-mail é obrigatório' })
  @IsEmail({}, { message: 'Campo e-mail deve conter um email válido' })
  email: string;

  @IsNotEmpty({ message: 'Campo senha é obrigatório' })
  @MinLength(8, { message: 'Senha deve conter no mínimo 6 caracteres' })
  @MaxLength(25, { message: 'Senha deve conter no máximo 25 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'Campo telefone é obrigatório' })
  @MinLength(11, { message: 'Telefone deve conter no mínimo 11 caracteres' })
  @MaxLength(11, { message: 'Telefone deve conter no máximo 11 caracteres' })
  telephone: string;
}
