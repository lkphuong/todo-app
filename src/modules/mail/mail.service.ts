import { Injectable } from '@nestjs/common';
import { sendEmail } from 'src/common/utils/sendEmail';

@Injectable()
export class MailService {
  async sendMailToUser(email: string) {
    await sendEmail(email);
  }
}
