import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}
  @Post()
  async sendMail(@Body('email') data: any) {
    await this.mailService.sendMailToUser(data);
    return true;
  }
}
