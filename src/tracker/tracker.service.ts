// import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

@Injectable()
export class TrackerService {
  async getCurrentPrice() {
    await Moralis.start({
      apiKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjBmNjkxZjEyLWFjYzYtNGNiMy1hMGY4LWY2Mjk1ZmJjMGUyMCIsIm9yZ0lkIjoiNDA3MjE4IiwidXNlcklkIjoiNDE4NDM3IiwidHlwZUlkIjoiNDYwZGIwNTMtYWY4MC00YjdlLTgzNGUtMjJlMjhmNTUzOWQ0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjU1NDYyNTcsImV4cCI6NDg4MTMwNjI1N30.Nr07HrVULkpyv1UVCGt2GmJjkx2lQugiZw-oFmV6IRI',
    });

    const chain = EvmChain.ETHEREUM;
    const address_pol = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain,
      include: 'percent_change',
      address: address_pol,
    });

    return response;
  }
}
