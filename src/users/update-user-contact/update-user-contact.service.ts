import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { RequestUpdateUserContact } from '../dtos/request-update-user-contact';
import { JwtPayloadDto } from '../../auth/dtos/jwt-payload.dto';

@Injectable()
export class UpdateUserContactService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  private readonly logger = new Logger(UpdateUserContactService.name);

  async execute(
    contactInfo: RequestUpdateUserContact,
    user: JwtPayloadDto,
  ): Promise<void> {
    const found = await this.userRepository.findOne(user.id);

    if (!found) {
      throw new NotFoundException('Usuário não encontrado');
    }

    found.telephone = contactInfo.telephone;
    found.email = contactInfo.email;

    try {
      await this.userRepository.save(found);
    } catch (e) {
      this.logger.error('Erro ao atualizar contato de usuário no banco', e);
      throw new InternalServerErrorException(
        'Algo deu errado, tente novamente mais tarde',
      );
    }
  }
}
