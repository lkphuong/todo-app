import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  Response,
  StreamableFile,
  Inject,
  ForbiddenException,
  NotFoundException,
  CacheInterceptor,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/utils/storage';
import { ToDoDto } from './dto/todo.dto';
import { ToDoService } from './todo.service';
import { REQUEST } from '@nestjs/core';

@Controller('todo')
export class ToDoController {
  constructor(
    private todoService: ToDoService,
    @Inject(REQUEST)
    private request: any,
  ) {}

  @Get()
  async getAll() {
    const user = await this.request.user;
    console.log(user);
    if (user.role == 1) {
      return await this.todoService.findAll();
    }
    throw new ForbiddenException();
  }

  @Get('getById/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const todo = await this.todoService.findOne(id);
    const user = await this.request.user;

    if (todo) {
      if (todo.user.id == user.id) {
        return await this.todoService.findOne(id);
      }
      throw new ForbiddenException();
    }
    throw new NotFoundException();
  }

  @Get('/export')
  async getFile(@Response({ passthrough: true }) res): Promise<StreamableFile> {
    const fileExcel = await this.todoService.exportExcel();
    console.log(fileExcel);
    const file = createReadStream(join(process.cwd(), 'download.xlsx'));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="download.xlsx"',
    });
    return new StreamableFile(file);
  }
  //   res.set({
  //     'Content-Type': 'application/json',
  //     'Content-Disposition': 'attachment; filename="package.json"',
  //   });
  //   return new StreamableFile(file);
  // }
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

  @Post('/import')
  @UseInterceptors(FileInterceptor('file', storage))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    //return await this.todoService.importExcel();
    // console.log(file);
    // console.log(file.path);
    const user = await this.request.user;
    console.log(user);
    if (user.role === 1) {
      return await this.todoService.importExcel(file.path);
    }
    throw new ForbiddenException();
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
