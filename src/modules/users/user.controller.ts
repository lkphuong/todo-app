import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ValidationUsernamePipe } from '../../common/pipes/validateUsername.pip';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ROLE } from 'src/common/enum/role.enum';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { REQUEST } from '@nestjs/core';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(REQUEST)
    private request: any,
  ) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin)
  @Get()
  async getAll() {
    //console.log(await this.request.user);
    const user = await this.userService.findAll();
    return user;
  }

  // @Get(':id')
  // async getById(@Param('id', ParseIntPipe) id: number) {
  //   return await this.userService.findOne(id);
  // }

  @Post()
  async create(@Body(new ValidationUsernamePipe()) user: UserDto) {
    const newUser = await this.userService.create(user);
    delete newUser.password;
    return {
      errorCode: 0,
      data: newUser,
      message: '',
      errors: [],
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDto: UserDto,
  ) {
    const user = await this.request.user;
    if (id === user.id) {
      return await this.userService.update(id, userDto);
    } else throw new ForbiddenException();
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const user = await this.request.user;
    if (id === user.id) {
      await this.userService.remove(id);
      return {
        errorCode: 0,
        data: [],
        message: 'delete success',
        erros: [],
      };
    }
    throw new ForbiddenException();
  }
}
