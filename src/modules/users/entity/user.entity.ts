import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ToDoEntity } from '../../todos/entity/todo.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  // @Column({ select: false })
  @Column()
  password: string;

  @Column({ default: 0 })
  role: number;

  @Column({ default: null })
  refreshToken?: string;

  @OneToMany(() => ToDoEntity, (todo) => todo.user)
  todos: ToDoEntity[];
}
