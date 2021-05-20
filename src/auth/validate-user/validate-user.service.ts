import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { UserDataDto } from '../dtos/user-data.dto';

interface UserCredentials {
  email: string;
  password: string;
}

@Injectable()
export class ValidateUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(credentials: UserCredentials): Promise<UserDataDto | null> {
    const found = await this.userRepository.findOne({
      where: { email: credentials.email },
    });

    if (found && (await found.comparePassword(credentials.password))) {
      if (!found.active)
        throw new ForbiddenException(
          'Você deve confirmar sua conta no e-mail cadastrado.',
        );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, createdAt, updatedAt, ...rest } = found;
      return rest;
    }

    return null;
  }
}
