import { Injectable } from '@nestjs/common';
import { UserService } from '../../modules/users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { TokenDto } from 'src/modules/users/dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { id: user.id, username: user.username, role: user.role };
    const refresh_token = await this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '3d',
    });
    const tokenDto: TokenDto = {
      refreshToken: refresh_token,
    };
    await this.userService.refreshToken(user.id, tokenDto);
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refresh_token,
    };
  }

  async refreshToken(refresh_token: string) {
    const user = await this.userService.findUserByRefreshToken(refresh_token);
    const payload = { id: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
