import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RequestCreateUserDto } from './dtos/request-create-user.dto';
import { CreateUserService } from './create-user/create-user.service';
import { UpdateUserContactService } from './update-user-contact/update-user-contact.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequestUpdateUserContact } from './dtos/request-update-user-contact';
import { User } from '../decorators/user.decorator';
import { ConfirmUserService } from './confirm-user/confirm-user.service';
import { JwtPayloadDto } from '../auth/dtos/jwt-payload.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly updateUserContactService: UpdateUserContactService,
    private readonly confirmUserService: ConfirmUserService,
  ) {}
  @Post()
  createUser(
    @Body() userData: RequestCreateUserDto,
  ): Promise<{ message: string }> {
    return this.createUserService.execute(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-contact')
  updateContact(
    @Body() contactParams: RequestUpdateUserContact,
    @User() user: JwtPayloadDto,
  ): Promise<void> {
    return this.updateUserContactService.execute(contactParams, user);
  }

  @Put('confirm-user/:token')
  confirmUser(@Param('token') token: string): Promise<void> {
    return this.confirmUserService.execute(token);
  }
}
