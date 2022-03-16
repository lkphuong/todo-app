import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  async sendMailToUser() {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'tengu.noreply@gmail.com',
        pass: 'tengu123456789',
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: 'kphuonght22@gmail.com',
      subject: 'Hello ✔',
      text: 'Hello world?',
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        return 'err';
      } else {
        console.log(info.response);
        return 'success';
      }
    });
  }
}
