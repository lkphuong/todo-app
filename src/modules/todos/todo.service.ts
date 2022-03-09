import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToDoEntity } from './entity/todo.entity';
import { ToDoDto } from './dto/todo.dto';

@Injectable()
export class ToDoService {
  constructor(
    @InjectRepository(ToDoEntity)
    private todoRepository: Repository<ToDoEntity>,
  ) {}
  findAll(): Promise<ToDoEntity[]> {
    return this.todoRepository.find({ relations: ['user'] });
  }

  findOne(id: number): Promise<ToDoEntity> {
    return this.todoRepository.findOne(id, { relations: ['user'] });
  }

  async create(user: ToDoDto) {
    const newUser = this.todoRepository.create(user);
    await this.todoRepository.save(user);
    return newUser;
  }

  async remove(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
