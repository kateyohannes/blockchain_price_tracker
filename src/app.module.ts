import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TrackerModule } from './tracker/tracker.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    HttpModule,
    DatabaseModule,
    TrackerModule,
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class AppModule {}
