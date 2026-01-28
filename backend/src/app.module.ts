import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ReservationsModule } from './reservations/reservations.module'
import { PaymentsModule } from './payments/payments.module';
import { EventsModule } from './events/events.module';
import { AccessModule } from './access/access.module';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
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
    EventsModule,
    AccessModule
  ],
})
export class AppModule { }
