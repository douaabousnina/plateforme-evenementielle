import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ReservationsModule } from './reservations/reservations.module'
import { PaymentsModule } from './payments/payments.module';
import { AccessModule } from './access/access.module';
import { Ticket } from './access/entities/ticket.entity';
import { ScanLog } from './access/entities/scan-log.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      retryAttempts: 10,
      retryDelay: 3000,

      synchronize: true,
    }),
    ReservationsModule,
    PaymentsModule,
  ],
})
export class AppModule { }
