import { CacheInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/ormconfig';
import { IndexModule } from './modules/index.module';
import { AuthModule } from './common/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventsGateway } from './chat.gateway';
import { CacheModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/images'),
    }),
    CacheModule.register({
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
    }),
    ClientsModule.register([
      {
        name: 'SOCKET',
        transport: Transport.TCP,
        options: { port: 3001 },
      },
    ]),
    AuthModule,
    IndexModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EventsGateway,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
