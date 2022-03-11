import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToDoEntity } from './entity/todo.entity';
import { ToDoDto } from './dto/todo.dto';
import { getConnection } from 'typeorm';
import { convertJsonToExcel } from '../../common/utils/convertJsonToExcel';
import { readFileExcel } from '../../common/utils/readFileExcel';

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

  async create(todo: ToDoDto) {
    const newTodo = this.todoRepository.create(todo);
    await this.todoRepository.save(todo);
    return newTodo;
  }

  async remove(id: number): Promise<void> {
    await this.todoRepository.delete(id);
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
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into('to_do_entity')
      .values(data)
      .execute();
    return data;
  }
}
