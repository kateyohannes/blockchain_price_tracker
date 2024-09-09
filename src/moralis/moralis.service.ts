import Moralis from 'moralis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EvmChain } from '@moralisweb3/common-evm-utils';

@Injectable()
export class MoralisService {
  constructor(private readonly configService: ConfigService) {
    Moralis.start({
      //   apiKey: this.configService.getOrThrow('MORALIS_API_KEY_Y'),
      apiKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjBmNjkxZjEyLWFjYzYtNGNiMy1hMGY4LWY2Mjk1ZmJjMGUyMCIsIm9yZ0lkIjoiNDA3MjE4IiwidXNlcklkIjoiNDE4NDM3IiwidHlwZUlkIjoiNDYwZGIwNTMtYWY4MC00YjdlLTgzNGUtMjJlMjhmNTUzOWQ0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjU1NDYyNTcsImV4cCI6NDg4MTMwNjI1N30.Nr07HrVULkpyv1UVCGt2GmJjkx2lQugiZw-oFmV6IRI',
    });
  }

  async fetchPrice() {
    const chain = EvmChain.ETHEREUM;
    const address_pol = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
    const data = await Moralis.EvmApi.token.getTokenPrice({
      chain,
      include: 'percent_change',
      address: address_pol,
    });

    return data;
  }
}
