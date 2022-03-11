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
} from '@nestjs/common';
import { createReadStream, unlink } from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/utils/storage';
import { ToDoDto } from './dto/todo.dto';
import { ToDoService } from './todo.service';

@Controller('todo')
export class ToDoController {
  constructor(private todoService: ToDoService) {}

  @Get()
  async getAll() {
    return await this.todoService.findAll();
  }

  @Get('getById/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.todoService.findOne(id);
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
    console.log(file);
    console.log(file.path);
    return await this.todoService.importExcel(file.path);
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
