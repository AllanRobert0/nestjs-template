import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { RequestUpdateUserPasswordDto } from '../../auth/dtos/request-update-user-password.dto';

@Injectable()
export class UpdateUserPasswordService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  private readonly logger = new Logger(UpdateUserPasswordService.name);

  async execute(
    { password, passwordConfirmation }: RequestUpdateUserPasswordDto,
    userId: string,
  ): Promise<void> {
    if (password !== passwordConfirmation) {
      throw new BadRequestException('As senhas devem ser iguais');
    }

    const found = await this.userRepository.findOne(userId);

    if (!found) {
      throw new NotFoundException('Usuário não encontrado');
    }

    found.password = password;

    try {
      await this.userRepository.save(found);
    } catch (e) {
      this.logger.error('Erro ao atualizar senha de usuário no banco', e);
      throw new InternalServerErrorException(
        'Algo deu errado, tente novamente mais tarde',
      );
    }
  }
}
