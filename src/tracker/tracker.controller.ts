import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get()
  async findAll() {
    // return await this.trackerService.findAll();
    return await this.trackerService.currentPrice();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.trackerService.findOne(+id);
  }

  @Post()
  async createOne(@Body() createTrackerDto: CreateTrackerDto) {
    return await this.trackerService.create(createTrackerDto);
  }
}
