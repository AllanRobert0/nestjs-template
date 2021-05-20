import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserService } from './create-user/create-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserSubscriber } from '../subscribers/user.subscriber';
import { UpdateUserContactService } from './update-user-contact/update-user-contact.service';
import { UpdateUserPasswordService } from './update-user-password/update-user-password.service';
import { MailerModule } from '../mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfirmUserService } from './confirm-user/confirm-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MailerModule,
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
  ],
  controllers: [UsersController],
  providers: [
    CreateUserService,
    UserSubscriber,
    UpdateUserContactService,
    UpdateUserPasswordService,
    ConfirmUserService,
  ],
  exports: [UpdateUserPasswordService],
})
export class UsersModule {}
