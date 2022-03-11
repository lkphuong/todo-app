import { IsNotEmpty, IsString } from 'class-validator';
export class ToDoDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  description: string;
}
