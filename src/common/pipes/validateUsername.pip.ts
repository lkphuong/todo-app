import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ValidationUsernamePipe implements PipeTransform {
  async transform(value: any) {
    value.username = value.username.replace(/\s/g, '');
    return value;
  }
}
