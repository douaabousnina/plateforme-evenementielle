import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',  
      host: 'localhost',  
      port: 5432, 
      username: 'postgres', 
      password: 'maryem222',  
      database: 'users',  
      entities: [User],  
      synchronize: true,  
      logging: true,  
    }),
    
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
