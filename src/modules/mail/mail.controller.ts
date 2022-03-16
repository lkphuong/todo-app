import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}
  @Post()
  async sendMail() {
    const check = await this.mailService.sendMailToUser();
    console.log(check);
    return true;
  }
}
