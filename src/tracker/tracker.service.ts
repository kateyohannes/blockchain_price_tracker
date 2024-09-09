import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tracker } from './entities/tracker.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { MoralisService } from '../moralis/moralis.service';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker)
    private trackerRepository: Repository<Tracker>,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    private readonly moralisService: MoralisService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const data = await this.moralisService.fetchPrice();
    console.log(data.raw);
  }

  async create(createTrackerDto: CreateTrackerDto) {
    const tracker = new Tracker(createTrackerDto);
    const data = await this.entityManager.save(tracker);
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
    const response = this.moralisService.fetchPrice();

    return response;
  }
}
