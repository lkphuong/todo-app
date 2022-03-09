import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/ormconfig';
import { IndexModule } from './modules/index.module';
import { AuthModule } from './common/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), IndexModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
