import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as Email from 'email-templates';
import * as path from 'path';

interface SendMailDto {
  to: string;
  subject: string;
  template: string;
  data: any;
}

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}
  private transporter = createTransport({
    service: 'gmail',
    auth: {
      user: this.configService.get('EMAIL_USER'),
      pass: this.configService.get('EMAIL_PASSWORD'),
    },
  });
  private email = new Email({
    message: {
      from: this.configService.get('EMAIL_USER'),
    },
    views: {
      options: {
        extension: 'hbs',
      },
    },
    send: true,
    preview: false,
    transport: this.transporter,
  });

  async sendMail({ subject, to, template, data }: SendMailDto): Promise<void> {
    await this.email.send({
      message: {
        to,
        subject,
      },
      template: path.join(
        __dirname,
        '..',
        '..',
        'src',
        'email-templates',
        template,
      ),
      locals: { ...data },
    });
  }
}
