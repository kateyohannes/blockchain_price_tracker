import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { MoralisService } from '../moralis/moralis.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateMailDto } from '../mail/dto/create-mail.dto';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private alertRepositery: Repository<Alert>,
    private readonly entityManagment: EntityManager,
    private readonly moralisService: MoralisService,
    private readonly configService: ConfigService,
  ) {}

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

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const response = await this.moralisService.fetchPrice();
    const data = await this.alertRepositery.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    if (Number(response?.raw.usdPrice) > Number(data[0]?.price)) {
      const input: CreateMailDto = {
        from: { name: 'Yohannes Teshome', address: 'kateyohannes@gmail.com' },
        recipients: [
          { name: 'Hyperhire', address: 'hyperhire_assignment@hyperhire.in' },
        ],
        subject: 'Price Change',
        html: '<p>Price has increased by 20%</p>',
      };

      await this.sendEmail(input);
      return;
    }
  }

  async create(createAlertDto: CreateAlertDto) {
    const data = new Alert(createAlertDto);
    return await this.entityManagment.save(data);
  }

  async findAll() {
    return await this.alertRepositery.find();
  }
  async findOne(id: number) {
    return await this.alertRepositery.findOneByOrFail({ id });
  }

  async update(id: number, updateAlertDto: UpdateAlertDto) {
    const data = await this.alertRepositery.findOneByOrFail({ id });
    if (!data) {
      throw new Error('Not Found!');
    }
    data.price = updateAlertDto.price;
    await this.entityManagment.save(data);
  }

  async remove(id: number) {
    return await this.alertRepositery.delete(id);
  }
}
