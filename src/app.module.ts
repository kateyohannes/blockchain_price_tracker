import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackerController } from './tracker/tracker.controller';
import { TrackerService } from './tracker/tracker.service';

@Module({
  imports: [],
  controllers: [AppController, TrackerController],
  providers: [AppService, TrackerService],
})
export class AppModule {}
