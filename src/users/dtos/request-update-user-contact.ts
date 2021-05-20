import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RequestUpdateUserContact {
  @IsNotEmpty({ message: 'Campo e-mail é obrigatório' })
  @IsEmail({}, { message: 'Campo e-mail deve conter um email válido' })
  email: string;

  @IsNotEmpty({ message: 'Campo telefone é obrigatório' })
  @MinLength(11, { message: 'Telefone deve conter no mínimo 11 caracteres' })
  @MaxLength(11, { message: 'Telefone deve conter no máximo 11 caracteres' })
  telephone: string;
}
