import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    const existingAdmin = await usersService.findByEmail('admin@plateforme.com');
    if (existingAdmin) {
      console.log('Admin already exists!');
      return;
    }
    

    const adminUser = await usersService.create({
      email: 'admin@plateforme.com',
      password: 'admin123456',
      role: Role.ORGANIZER, 
      preferences: []
    });


  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await app.close();
  }
}

createAdmin();