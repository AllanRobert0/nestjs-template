import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeOrmConfig] }),
    TypeOrmModule.forRoot(typeOrmConfig()),
    UsersModule,
    AuthModule,
    MailerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
