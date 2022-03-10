import { Injectable } from '@nestjs/common';
import { UserService } from '../../modules/users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Public } from './setMetadata';

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

  @Public()
  async login(user: any) {
    console.log('user: ' + user);
    const payload = { username: user.username, role: user.role };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
