import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { bcryptSalt } from '../../config/bcrypt';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @Inject(REQUEST)
    private request: any,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find({ relations: ['todos'] });
  }

  async findOne(username: string): Promise<UserEntity> {
    const userRequest = this.request.user;
    const user = await this.usersRepository.findOne(
      { username: username },
      { relations: ['todos'] },
    );
    if (user !== undefined && user) {
      if (user.username === userRequest.username) {
        return user;
      }
      throw new ForbiddenException();
    }
    throw new NotFoundException();
  }

  // async findByUsername(username: string) {
  //   return await this.usersRepository.findOne({ username: username });
  // }

  async create(user: UserDto) {
    user.password = await bcrypt.hash(user.password, bcryptSalt.salt);
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(user);
    return newUser;
  }

  async update(id: number, userDto: Partial<UserDto>): Promise<UserEntity> {
    const userRequest = this.request.user;
    const user = await this.usersRepository.findOne(id, {
      relations: ['todos'],
    });
    if (user !== undefined && user) {
      if (user.username === userRequest.username) {
        await this.usersRepository.update(id, userDto);
        return this.usersRepository.findOne(id);
      }
      throw new ForbiddenException();
    }
    throw new NotFoundException();
  }

  async remove(id: number) {
    const userRequest = this.request.user;
    const user = await this.usersRepository.findOne(id);
    if (user !== undefined && user) {
      if (user.username === userRequest.username) {
        await this.usersRepository.delete(id);
        return { delete: true };
      }
      throw new ForbiddenException();
    }
    throw new NotFoundException();
  }
}
