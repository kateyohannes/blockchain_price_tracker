import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackerController } from './tracker/tracker.controller';
import { TrackerService } from './tracker/tracker.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, TrackerController],
  providers: [AppService, TrackerService],
})
export class AppModule {}
