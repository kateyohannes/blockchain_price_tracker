import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tracker } from './entities/tracker.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { EvmChain } from '@moralisweb3/common-evm-utils';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { MoralisService } from 'nestjs-moralis';
import Moralis from 'moralis';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker)
    private trackerRepository: Repository<Tracker>,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    private readonly moralisService: MoralisService,
  ) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async handleCron() {
  //   await Moralis.start({
  //     apiKey: this.configService.getOrThrow('MORALIS_API_KEY_Y'),
  //   });

  //   const chain = EvmChain.ETHEREUM;
  //   const address_pol = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
  //   const data = await Moralis.EvmApi.token.getTokenPrice({
  //     chain,
  //     include: 'percent_change',
  //     address: address_pol,
  //   });

  //   console.log(data.raw);
  // }

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
    await Moralis.start({
      apiKey: this.configService.getOrThrow('MORALIS_API_KEY_Y'),
    });

    const chain = EvmChain.ETHEREUM;
    const address_pol = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain,
      include: 'percent_change',
      address: address_pol,
    });

    return response.raw;
  }
}
