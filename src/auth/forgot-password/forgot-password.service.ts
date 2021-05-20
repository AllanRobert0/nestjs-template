import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../../mailer/mailer.service';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  private readonly logger = new Logger(ForgotPasswordService.name);

  async execute(email: string): Promise<void> {
    const found = await this.userRepository.findOne({ where: { email } });

    if (found) {
      const jwtPayload = {
        id: found.id,
      };

      const token = await this.jwtService.signAsync(jwtPayload);

      try {
        await this.mailerService.sendMail({
          to: found.email,
          subject: 'Alteração de senha - App College',
          template: 'welcome',
          data: {
            name: 'Ola',
            token,
          },
        });
      } catch (e) {
        this.logger.error('Erro ao enviar email de forgot password.', e);
        throw new InternalServerErrorException(
          'Algo deu errado, tente novamente mais tarde.',
        );
      }
    }
  }
}
