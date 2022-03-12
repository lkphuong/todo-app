import {
  All,
  Controller,
  Get,
  Header,
  Headers,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './common/auth/auth.service';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { LocalAuthGuard } from './common/auth/local-auth.guard';
import { Public } from './common/auth/setMetadata';
import { replaceBearer } from './common/utils/replaceBearer';
import { storage } from './common/utils/storage';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

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
}
