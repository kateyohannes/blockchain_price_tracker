import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TrackerModule } from './tracker/tracker.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';
// import { MoralisModule } from 'nestjs-moralis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    HttpModule,
    DatabaseModule,
    TrackerModule,
    // MoralisModule.register({
    //   apiKey:
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjBmNjkxZjEyLWFjYzYtNGNiMy1hMGY4LWY2Mjk1ZmJjMGUyMCIsIm9yZ0lkIjoiNDA3MjE4IiwidXNlcklkIjoiNDE4NDM3IiwidHlwZUlkIjoiNDYwZGIwNTMtYWY4MC00YjdlLTgzNGUtMjJlMjhmNTUzOWQ0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjU1NDYyNTcsImV4cCI6NDg4MTMwNjI1N30.Nr07HrVULkpyv1UVCGt2GmJjkx2lQugiZw-oFmV6IRI',
    // }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class AppModule {}
