import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateUserService } from '../validate-user/validate-user.service';
import { UserDataDto } from '../dtos/user-data.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private validateUserService: ValidateUserService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserDataDto> {
    const user = await this.validateUserService.execute({
      email,
      password,
    });
    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha inválidos.');
    }
    return user;
  }
}
