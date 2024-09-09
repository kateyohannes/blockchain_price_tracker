import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tracker } from './entities/tracker.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MoralisService } from '../moralis/moralis.service';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker)
    private trackerRepository: Repository<Tracker>,
    private readonly entityManager: EntityManager,
    private readonly moralisService: MoralisService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
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
