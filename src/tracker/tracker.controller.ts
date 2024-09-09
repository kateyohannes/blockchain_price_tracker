import { Controller, Get, Param } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tracker Api')
@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get()
  async findAll() {
    return await this.trackerService.findAll();
  }

  @Get('/daily')
  async dailyPrice() {
    return await this.trackerService.datilyPriceList();
  }

  @Get('/current')
  async currentPrice() {
    return await this.trackerService.currentPrice();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.trackerService.findOne(+id);
  }
}
