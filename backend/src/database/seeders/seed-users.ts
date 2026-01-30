import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../common/enums/role.enum';
import * as crypto from 'crypto';

export async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const repo = dataSource.getRepository(User);

  // Check if users already exist
  const existingUsers = await repo.count();
  if (existingUsers > 0) {
    console.log('   Users already exist, skipping...');
    return repo.find();
  }

  // Simple hash for demo purposes (in production, use bcrypt)
  const passwordHash = crypto
    .createHash('sha256')
    .update('password123')
    .digest('hex');

  const users = repo.create([
    {
      email: 'organizer@example.com',
      password: passwordHash,
      role: Role.ORGANIZER,
      name: 'John',
      lastName: 'Organizer',
      phoneNumber: '+1234567890',
    },
    {
      email: 'client1@example.com',
      password: passwordHash,
      role: Role.CLIENT,
      name: 'Alice',
      lastName: 'Client',
      phoneNumber: '+1234567891',
    },
    {
      email: 'client2@example.com',
      password: passwordHash,
      role: Role.CLIENT,
      name: 'Bob',
      lastName: 'Client',
      phoneNumber: '+1234567892',
    },
    {
      email: 'client3@example.com',
      password: passwordHash,
      role: Role.CLIENT,
      name: 'Charlie',
      lastName: 'Client',
      phoneNumber: '+1234567893',
    },
    {
      email: 'admin@example.com',
      password: passwordHash,
      role: Role.ADMIN,
      name: 'Admin',
      lastName: 'User',
      phoneNumber: '+1234567894',
    },
  ]);

  return repo.save(users);
}
