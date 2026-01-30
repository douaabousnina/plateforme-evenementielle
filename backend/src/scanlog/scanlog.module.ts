import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScanlogController } from './scanlog.controller';
import { ScanlogService } from './scanlog.service';
import { ScanLog } from './entities/scan-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScanLog])],
  controllers: [ScanlogController],
  providers: [ScanlogService],
  exports: [ScanlogService],
})
export class ScanlogModule {}
