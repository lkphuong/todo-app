import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToDoEntity } from './entity/todo.entity';
import { ToDoDto } from './dto/todo.dto';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ToDoService {
  constructor(
    @InjectRepository(ToDoEntity)
    private todoRepository: Repository<ToDoEntity>,
    @Inject(REQUEST)
    private request: any,
  ) {}
  findAll(): Promise<ToDoEntity[]> {
    return this.todoRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<ToDoEntity> {
    const user = this.request.user;
    const todo = await this.todoRepository.findOne(id, { relations: ['user'] });
    if (todo !== undefined && todo) {
      if (user.id === todo.user.id) {
        return this.todoRepository.findOne(id, { relations: ['user'] });
      }
      throw new ForbiddenException();
    }
    throw new NotFoundException();
  }

  async create(todo: ToDoDto) {
    const newUser = this.todoRepository.create(todo);
    await this.todoRepository.save(todo);
    return newUser;
  }

  async update(id: number, todoDto: Partial<ToDoDto>): Promise<ToDoEntity> {
    const user = await this.request.user;
    const todo = await this.todoRepository.findOne(id, { relations: ['user'] });
    console.log(todo);
    if (todo !== undefined) {
      if (user.id === todo.user.id) {
        await this.todoRepository.update(id, todoDto);
        return await this.todoRepository.findOne(id);
      }
      throw new ForbiddenException();
    }
    throw new NotFoundException();
  }

  async remove(id: number) {
    const user = this.request.user;
    const todo = await this.todoRepository.findOne(id, { relations: ['user'] });
    if (todo) {
      if (user.id === todo.user.id) {
        await this.todoRepository.delete(id);
        return { delete: true };
      }
      throw new ForbiddenException();
    }
    throw new NotFoundException();
  }
}
