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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Get('/cache')
  async addToCache() {
    console.log('cache');
    return [{ id: 1, name: 'Nest' }];
  }

  // @Get()
  // index(@Res() response: Response) {
  //   response
  //     .type('text/html')
  //     .send(readFileSync(join(__dirname, '..', 'public/images')).toString());
  // }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((_) => ({ data: { hello: 'world' } } as MessageEvent)),
    );
  }
}
