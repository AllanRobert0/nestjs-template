import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from '../dtos/response-login.dto';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';

interface LoginParams {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class LoginService {
  constructor(private readonly jwtService: JwtService) {}
  async execute({ id, email, name }: LoginParams): Promise<ResponseLoginDto> {
    const payload: JwtPayloadDto = { id, email };
    return {
      token: await this.jwtService.signAsync(payload),
      name,
    };
  }
}
