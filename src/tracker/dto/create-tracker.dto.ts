import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackerDto {
  @ApiProperty()
  coin: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  currency?: string;
}
