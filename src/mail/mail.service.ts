import Mail from 'nodemailer/lib/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateMailDto } from './dto/create-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  mainTrasport() {
    const trasport = createTransport({
      host: this.configService.getOrThrow('MAIL_HOST'),
      port: this.configService.getOrThrow('MAIL_PORT'),
      secure: false, // true for port 465, false for other ports
      auth: {
        user: this.configService.getOrThrow('MAIL_USERNAME'),
        pass: this.configService.getOrThrow('MAIL_PASSWORD'),
      },
    });

    return trasport;
  }

  async sendEmail(createMailDto: CreateMailDto) {
    const { from, recipients, subject, html } = createMailDto;
    const transport = this.mainTrasport();

    const options: Mail.Options = {
      from: from ?? {
        name: this.configService.getOrThrow('APP_NAME'),
        address: this.configService.getOrThrow('DEFAULT_MAIL_FROM'),
      },
      to: recipients,
      subject,
      html,
    };

    try {
      const result = await transport.sendMail(options);
      return result;
    } catch (err) {
      console.log('Email failed to send: ', err);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleMessage() {
    const input: CreateMailDto = {
      from: { name: 'Yohannes Teshome', address: 'kateyohannes@gmail.com' },
      recipients: [
        { name: 'Hyperhire', address: 'hyperhire_assignment@hyperhire.in' },
      ],
      subject: 'Price Change',
      html: '<p>Price has increased by 20%</p>',
    };
    const response = await this.sendEmail(input);
    console.log(response);
  }
}
