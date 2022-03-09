import { Module } from '@nestjs/common';
import { TodoModule } from './todos/todo.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [UserModule, TodoModule],
})
export class IndexModule {}
