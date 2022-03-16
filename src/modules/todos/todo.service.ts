import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToDoEntity } from './entity/todo.entity';
import { ToDoDto } from './dto/todo.dto';
import { getConnection } from 'typeorm';
import { convertJsonToExcel } from '../../common/utils/convertJsonToExcel';
import { readFileExcel } from '../../common/utils/readFileExcel';
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
    const todo = await this.todoRepository.findOne(id, { relations: ['user'] });
    if (todo) {
      return todo;
    }
    throw new NotFoundException();
  }

  async create(todo: ToDoDto) {
    // const newTodo = this.todoRepository.create(todo);
    // await this.todoRepository.save(todo);
    return await this.todoRepository.save(todo);
  }

  async update(id: number, todoDto: Partial<ToDoDto>) {
    const todo = await this.todoRepository.findOne(id);
    if (todo) {
      return await this.todoRepository.update(id, todoDto);
    }
    throw new NotFoundException();
  }

  async remove(id: number): Promise<void> {
    const todo = await this.todoRepository.findOne(id);
    if (todo) {
      await this.todoRepository.delete(id);
    }
    throw new NotFoundException();
  }

  async exportExcel() {
    const todos = await this.todoRepository.find({ relations: ['user'] });

    const todoForamted = todos.map((todo) => {
      return {
        ...todo,
        user: todo.user.id,
      };
    });

    convertJsonToExcel(todoForamted);
    return 'Export success';
  }

  async importExcel(pathFile: string) {
    const data = readFileExcel(pathFile);
    console.log(data);
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into('to_do_entity')
      .values(data)
      .execute();
    //return data;
  }
}
