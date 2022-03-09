import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { bcryptSalt } from '../../config/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
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
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(user);
    return newUser;
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
    return { delete: true };
  }
}
