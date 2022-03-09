import { Controller, Post, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('auth/login')
  // async login(@Body() userEntity: any) {
  //   const user = await this.authService.validateUser(
  //     userEntity.username,
  //     userEntity.password,
  //   );
  //   if (user) {
  //     const access_token = await this.authService.login(user);
  //     return {
  //       errorCode: 0,
  //       access_token,
  //       message: '',
  //       errors: [],
  //     };
  //   }
  //   throw new BadRequestException();
  // }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
