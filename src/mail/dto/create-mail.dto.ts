import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'nodemailer/lib/mailer';

export class CreateMailDto {
  @ApiProperty()
  from: Address;

  @ApiProperty()
  recipients: Address[];

  @ApiProperty()
  subject: string;

  @ApiProperty()
  html: string;
}
