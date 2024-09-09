import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tracker } from './entities/tracker.entity';
import { Between, EntityManager, Repository } from 'typeorm';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MoralisService } from '../moralis/moralis.service';
import Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';
import { CreateMailDto } from 'src/mail/dto/create-mail.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker)
    private trackerRepository: Repository<Tracker>,
    private readonly entityManager: EntityManager,
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
  async threePercentHigherCron() {
    const response = await this.moralisService.fetchPrice();
    const now = new Date();
    const nowModifiedWithLocal = new Date(
      now.getTime() + Number(9 * 60 * 60 * 1000),
    );
    const startOfPeriod = new Date(now.getTime() + Number(8 * 60 * 60 * 1000));
    const data = await this.trackerRepository.find({
      where: {
        createdAt: Between(startOfPeriod, nowModifiedWithLocal),
      },
    });

    const priceChange = Number(response.raw.usdPrice) - Number(data[0]?.price);
    const percent = (priceChange / Number(data[0]?.price)) * 100;

    if (percent > 3) {
      const input: CreateMailDto = {
        from: { name: 'Yohannes Teshome', address: 'kateyohannes@gmail.com' },
        recipients: [
          { name: 'Hyperhire', address: 'hyperhire_assignment@hyperhire.in' },
        ],
        subject: 'Price Change',
        html: `<p>Price has increased by ${percent}</p>`,
      };

      await this.sendEmail(input);
      console.log('email sent');
      return;
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fiveMiuteWriteCron() {
    const response = await this.moralisService.fetchPrice();
    const { nativePrice, usdPrice } = response.raw;
    const input: CreateTrackerDto = new Tracker({
      price: Number(usdPrice),
      coin: nativePrice.name,
    });
    return await this.entityManager.save(input);
  }

  async findAll() {
    return await this.trackerRepository.find();
  }

  async findOne(id: number) {
    return await this.trackerRepository.findOneByOrFail({ id });
  }

  async datilyPriceList() {
    const now = new Date();
    const startOfPeriod = new Date(now.getTime() - Number(24 * 60 * 60 * 1000));
    const data = await this.trackerRepository
      .createQueryBuilder('priceRecord')
      .select('DATE_FORMAT(priceRecord.createdAt, "%Y-%m-%d %H:00:00")', 'hour')
      .addSelect('SUM(priceRecord.price)', 'totalPrice')
      .where('priceRecord.createdAt BETWEEN :startOfPeriod AND :now', {
        startOfPeriod: startOfPeriod
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
        now: now.toISOString().slice(0, 19).replace('T', ' '),
      })
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    return data;
  }

  async currentPrice() {
    const response = await this.moralisService.fetchPrice();
    return response.raw;
  }
}
