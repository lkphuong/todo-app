import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { TokenDto } from './dto/token.dto';
import * as bcrypt from 'bcrypt';
import { bcryptSalt } from '../../config/bcrypt';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    // console.log(await this.request.user);
    return await this.usersRepository.find({ relations: ['todos'] });
  }

  async findOne(username: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ username: username });
  }

  // async findByUsername(username: string) {
  //   return await this.usersRepository.findOne({ username: username });
  // }

  async create(user: UserDto) {
    user.password = await bcrypt.hash(user.password, bcryptSalt.salt);
    // const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
    return { delete: true };
  }

  async refreshToken(id: number, refresh_token: Partial<TokenDto>) {
    await this.usersRepository.update(id, refresh_token);
  }

  async findUserByRefreshToken(refresh_token: string) {
    const user = await this.usersRepository.findOne({
      refreshToken: refresh_token,
    });
    if (user) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
