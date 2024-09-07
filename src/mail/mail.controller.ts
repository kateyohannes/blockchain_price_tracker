import { Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send')
  async sendMail() {
    const input: CreateMailDto = {
      from: { name: 'Yohannes Teshome', address: 'kateyohannes@gmail.com' },
      recipients: [{ name: 'Tamir', address: 'gizeworkmarye16@gmail.com' }],
      subject: 'Price Change',
      html: '<p>Price has increased by 20%</p>',
    };

    return await this.mailService.sendEmail(input);
  }

  @Get()
  async checkMailController() {
    return 'Its Working';
  }
}
