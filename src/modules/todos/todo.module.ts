import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDoEntity } from './entity/todo.entity';
import { ToDoService } from './todo.service';
import { ToDoController } from './todo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ToDoEntity])],
  controllers: [ToDoController],
  providers: [ToDoService],
})
export class TodoModule {}
