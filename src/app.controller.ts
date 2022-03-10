import {
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { AppService } from './app.service';
import { AuthService } from './common/auth/auth.service';
import { LocalAuthGuard } from './common/auth/local-auth.guard';

export const storage = {
  storage: diskStorage({
    destination: './image',
    filename: (req, file, cb) => {
      const filename = file.originalname.replace(/\s/g, '');
      // const filename: string = path
      //   .parse(file.originalname)
      //   .name.replace(/\s/g, '');
      // const extension: string = path.parse(file.originalname).ext;

      cb(null, filename);
    },
  }),
};

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }
}
