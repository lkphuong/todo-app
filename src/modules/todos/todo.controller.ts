import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Delete,
} from '@nestjs/common';
import { ToDoDto } from './dto/todo.dto';
import { ToDoService } from './todo.service';

@Controller('todo')
export class ToDoController {
  constructor(private todoService: ToDoService) {}

  @Get()
  async getAll() {
    return await this.todoService.findAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.todoService.findOne(id);
  }

  @Post()
  async create(@Body() todo: ToDoDto) {
    const newTodo = await this.todoService.create(todo);
    return {
      errorCode: 0,
      data: newTodo,
      message: '',
      errors: [],
    };
  }
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.todoService.remove(id);
    return {
      errorCode: 0,
      data: [],
      message: 'delete success',
      erros: [],
    };
  }
}
