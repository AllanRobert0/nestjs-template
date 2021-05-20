import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RequestUpdateUserPasswordDto {
  @IsNotEmpty({ message: 'Campo senha é obrigatório' })
  @MinLength(8, { message: 'Senha deve conter no mínimo 6 caracteres' })
  @MaxLength(25, { message: 'Senha deve conter no máximo 25 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'Campo senha é obrigatório' })
  @MinLength(8, { message: 'Senha deve conter no mínimo 6 caracteres' })
  @MaxLength(25, { message: 'Senha deve conter no máximo 25 caracteres' })
  passwordConfirmation: string;
}
