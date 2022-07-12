import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async sendUserConfirmation(user: User, token: string) {
    const baseUrl = this.config.get('CORS_ORIGIN');
    const url = `${baseUrl}/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: `"Support Team" <support@${baseUrl}>`, // override default from
      subject:
        'Welcome to Lingua Franca! Please confirm your Email by clicking the link below.',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        username: user.username,
        url,
      },
    });
  }

  maskEmail(email: string) {
    const [name, domain] = email.split('@');
    const { length: len } = name;
    const maskedName = name[0] + '...' + name[len - 1];
    const maskedEmail = maskedName + '@' + domain;
    return maskedEmail;
  }
}
