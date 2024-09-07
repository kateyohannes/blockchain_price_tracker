// // moralis.service.ts
// import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import Moralis from 'moralis';

// @Injectable()
// export class MoralisService implements OnModuleInit {
//   private static instance: MoralisService;
//   private readonly logger = new Logger(MoralisService.name);

//   private constructor(private readonly configService: ConfigService) {}

//   static getInstance(): MoralisService {
//     if (!MoralisService.instance) {
//       MoralisService.instance = new MoralisService();
//     }
//     return MoralisService.instance;
//   }

//   async onModuleInit() {
//     await this.initializeMoralis();
//   }

//   private async initializeMoralis() {
//     try {
//       if (!Moralis) {
//         // Ensure Moralis is not initialized already
//         await Moralis.start({
//           apiKey: this.configService.getOrThrow('MORALIS_API_KEY_Y'),
//         });
//         this.logger.log('Moralis SDK initialized successfully.');
//       }
//     } catch (error) {
//       this.logger.error('Failed to initialize Moralis SDK', error.stack);
//     }
//   }

//   getMoralis() {
//     return Moralis;
//   }
// }
