import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { Ticket } from './entities/ticket.entity';
import { ScanLog } from './entities/scan-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, ScanLog])],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
