import { Module } from '@nestjs/common';
import { ValidateUserService } from './validate-user/validate-user.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { LoginService } from './login/login.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { UsersModule } from '../users/users.module';
import { ValidateForgotPasswordTokenService } from './validate-forgot-password-token/validate-forgot-password-token.service';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('EXPIRES_IN') },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    MailerModule,
  ],
  providers: [
    ValidateUserService,
    LocalStrategy,
    JwtStrategy,
    LoginService,
    ForgotPasswordService,
    ValidateForgotPasswordTokenService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
