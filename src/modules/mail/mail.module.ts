import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        service: 'gmail',
        auth: {
          user: 'tengu.noreply@gmail.com',
          pass: 'tengu123456789',
        },
      },
      defaults: {
        from: 'tengu.noreply@gmail.com',
      },
      //   template: {
      //     dir: join(__dirname, 'templates'),
      //     adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
      //     options: {
      //       strict: true,
      //     },
      //   },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
