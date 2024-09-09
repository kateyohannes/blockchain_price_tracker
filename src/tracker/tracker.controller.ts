import { Controller, Get, Param } from '@nestjs/common';
import { TrackerService } from './tracker.service';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get()
  async findAll() {
    return await this.trackerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.trackerService.findOne(+id);
  }
}
