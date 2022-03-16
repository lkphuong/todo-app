import { Module } from '@nestjs/common';
import { TodoModule } from './todos/todo.module';
import { UserModule } from './users/user.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [UserModule, TodoModule, SchedulingModule],
})
export class IndexModule {}
