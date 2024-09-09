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
    const data = await this.entityManager.save(input);
    return data;
  }

  async findAll() {
    const data = await this.trackerRepository.find();
    return data;
  }

  async findOne(id: number) {
    const data = await this.trackerRepository.findOneByOrFail({ id });
    return data;
  }

  async currentPrice() {
    const response = await this.moralisService.fetchPrice();
    return response.raw;
  }
}
