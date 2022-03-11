import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/ormconfig';
import { IndexModule } from './modules/index.module';
import { AuthModule } from './common/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/images'),
    }),
    AuthModule,
    IndexModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
