import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from '../../auth/dtos/user-data.dto';
import { handleJWTErrors } from '../../utils/jwt.utils';

@Injectable()
export class ConfirmUserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  private readonly logger = new Logger(ConfirmUserService.name);

  async execute(token: string): Promise<void> {
    const decode = await this.verifyToken(token);
    const found = await this.userRepository.findOne(decode.id);

    found.active = true;

    try {
      await this.userRepository.save(found);
    } catch (error) {
      this.logger.error('Erro ao confirmar usuário.', error);
      throw new InternalServerErrorException(
        'Algo deu errado, tente novamente mais tarde',
      );
    }
  }

  async verifyToken(token: string): Promise<UserDataDto> {
    try {
      return await this.jwtService.verifyAsync<UserDataDto>(token);
    } catch (error) {
      throw new BadRequestException(handleJWTErrors(error));
    }
  }
}
