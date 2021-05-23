import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RequestCreateUserDto } from '../dtos/request-create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '../../mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(CreateUserService.name);

  async execute(userData: RequestCreateUserDto): Promise<{ message: string }> {
    const found = await this.findUserByEmailOrTelephone(
      userData.email,
      userData.telephone,
    );

    if (found) {
      throw new BadRequestException(
        'E-mail/telefone já cadastrado em nosso sistema.',
      );
    }

    try {
      const userToSave = this.userRepository.create(userData);
      const saved = await this.userRepository.save(userToSave);

      await this.sendConfirmationMail(saved.email, saved.id, saved.name);

      return {
        message: 'Confirme sua conta clicando no link enviado ao seu e-mail!',
      };
    } catch (e) {
      this.logger.error('Erro ao salvar usuário no banco.', e);
      throw new InternalServerErrorException(
        'Algo deu errado, tente novamente mais tarde.',
      );
    }
  }

  async findUserByEmailOrTelephone(
    email: string,
    telephone: string,
  ): Promise<UserEntity | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select('user')
      .where('user.email = :email', { email })
      .orWhere('user.telephone = :telephone', {
        telephone,
      })
      .getOne();
  }

  async sendConfirmationMail(
    email: string,
    id: string,
    name: string,
  ): Promise<void> {
    const jwtPayload = {
      id,
    };

    const token = await this.jwtService.signAsync(jwtPayload);

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirme seu e-mail - App',
        template: 'welcome',
        data: {
          name,
          token,
        },
      });
    } catch (e) {
      this.logger.error(`Erro ao enviar email para usuário: ${id}`);
      throw e;
    }
  }
}
