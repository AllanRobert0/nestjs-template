import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginService } from './login/login.service';
import { ResponseLoginDto } from './dtos/response-login.dto';
import { User } from '../decorators/user.decorator';
import { UserDataDto } from './dtos/user-data.dto';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { UpdateUserPasswordService } from '../users/update-user-password/update-user-password.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequestUpdateUserPasswordDto } from './dtos/request-update-user-password.dto';
import { ValidateForgotPasswordTokenService } from './validate-forgot-password-token/validate-forgot-password-token.service';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly updateUserPasswordService: UpdateUserPasswordService,
    private readonly validateForgotPasswordTokenService: ValidateForgotPasswordTokenService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserDataDto): Promise<ResponseLoginDto> {
    return this.loginService.execute({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  @Post('forgot-password/:email')
  async forgotPassword(@Param('email') email: string): Promise<void> {
    return this.forgotPasswordService.execute(email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password/signed-in')
  updatePasswordSignedIn(
    @Body() passwordParams: RequestUpdateUserPasswordDto,
    @User() user: JwtPayloadDto,
  ): Promise<void> {
    return this.updateUserPasswordService.execute(passwordParams, user.id);
  }

  @Put('change-password/signed-out/:token')
  async changePasswordSignedOut(
    @Param('token') token: string,
    @Body() passwordParams: RequestUpdateUserPasswordDto,
  ): Promise<void> {
    const id = await this.validateForgotPasswordTokenService.execute(token);

    return this.updateUserPasswordService.execute(passwordParams, id);
  }
}
