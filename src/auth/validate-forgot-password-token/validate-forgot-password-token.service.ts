import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { handleJWTErrors } from '../../utils/jwt.utils';

@Injectable()
export class ValidateForgotPasswordTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async execute(token: string): Promise<string> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded.id;
    } catch (e) {
      throw new UnauthorizedException(handleJWTErrors(e));
    }
  }
}
