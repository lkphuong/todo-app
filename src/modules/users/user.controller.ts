import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ValidationUsernamePipe } from '../../common/pipes/validateUsername.pip';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ROLE } from 'src/common/enum/role.enum';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin)
  @Get()
  async getAll() {
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

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.userService.remove(id);
    return {
      errorCode: 0,
      data: [],
      message: 'delete success',
      erros: [],
    };
  }
}
