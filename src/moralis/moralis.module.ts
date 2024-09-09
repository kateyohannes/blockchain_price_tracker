import { Module } from '@nestjs/common';
import { MoralisService } from './moralis.service';

@Module({
  providers: [MoralisService],
  exports: [MoralisService], // Export it for use in other modules
})
export class MoralisModule {}
