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
    
    const hash= await bcrypt.hash('admin123456', 10);
     await usersService.create({
      email: 'admin@plateforme.com',
      password: hash,
      role: Role.ADMIN, 
      preferences: []
    });


  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await app.close();
  }
}

createAdmin();