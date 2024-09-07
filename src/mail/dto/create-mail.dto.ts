import { Address } from 'nodemailer/lib/mailer';

export class CreateMailDto {
  from: Address;
  recipients: Address[];
  subject: string;
  html: string;
}
