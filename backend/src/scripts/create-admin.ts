import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';

async function seedAuth() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Seed admin user
    const existingAdmin = await usersService.findByEmail('admin@plateforme.com');
    if (!existingAdmin) {
      const adminHash = await bcrypt.hash('admin123456', 10);
      await usersService.create({
        email: 'admin@plateforme.com',
        password: adminHash,
        role: Role.ADMIN
      });
      console.log('✓ Admin user created');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Seed organizer user
    const existingOrganizer = await usersService.findByEmail('organizer@plateforme.com');
    if (!existingOrganizer) {
      const organizerHash = await bcrypt.hash('organizer123456', 10);
      await usersService.create({
        email: 'organizer@plateforme.com',
        password: organizerHash,
        role: Role.ORGANIZER
      });
      console.log('✓ Organizer user created');
    } else {
      console.log('✓ Organizer user already exists');
    }

    // Seed client user
    const existingClient = await usersService.findByEmail('client@plateforme.com');
    if (!existingClient) {
      const clientHash = await bcrypt.hash('client123456', 10);
      await usersService.create({
        email: 'client@plateforme.com',
        password: clientHash,
        role: Role.CLIENT
      });
      console.log('✓ Client user created');
    } else {
      console.log('✓ Client user already exists');
    }

    console.log('\n✓ Auth seeding completed successfully');
  } catch (error) {
    console.error('✗ Error during auth seeding:', error);
  } finally {
    await app.close();
  }
}

seedAuth();