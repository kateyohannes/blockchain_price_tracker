import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tracker } from './entities/tracker.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateTrackerDto } from './dto/create-tracker.dto';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker)
    private trackerRepository: Repository<Tracker>,
    private readonly entityManager: EntityManager,
  ) {}

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
}
