import {
  CacheInterceptor,
  Controller,
  Get,
  Headers,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  MessageEvent,
  Sse,
  Res,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { AuthService } from './common/auth/auth.service';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { LocalAuthGuard } from './common/auth/local-auth.guard';
import { Public } from './common/auth/setMetadata';
import { replaceBearer } from './common/utils/replaceBearer';
import { storage } from './common/utils/storage';
import { AppService } from './app.service';
import { interval, map, Observable } from 'rxjs';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
console.log(__dirname);
@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(
    private authService: AuthService,
    private appService: AppService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('refreshToken')
  async refreshToken(@Headers() headers) {
    let refreshToken: string = headers.authorization;
    refreshToken = replaceBearer(refreshToken);
    //console.log(refreshToken);
    return this.authService.refreshToken(refreshToken);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('upload')
  //@UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }

  @Post('uploadMultipleFiles')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'background', maxCount: 1 },
      ],
      storage,
    ),
  )
  upMultipleFiles(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    console.log(files);
  }

  @Get('/cache')
  async addToCache() {
    console.log('cache');
    return [{ id: 1, name: 'Nest' }];
  }

  @Get()
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, '..', 'src/index.html')).toString());
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((_) => ({ data: { Hello: 'World: ' + Date.now() } } as MessageEvent)),
    );
  }
}
