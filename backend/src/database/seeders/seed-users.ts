import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../common/enums/role.enum';
import { Preference } from '../../common/enums/preference.enum';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const repo = dataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const users = repo.create([
    {
      email: 'admin@seed.local',
      password: hashedPassword,
      role: Role.ADMIN,
      preferences: [Preference.TECH],
      name: 'Admin',
      lastName: 'Root',
      phoneNumber: '0600000000',
    },
    {
      email: 'organizer1@seed.local',
      password: hashedPassword,
      role: Role.ORGANIZER,
      preferences: [Preference.CONCERTS, Preference.FESTIVALS],
      name: 'Olivia',
      lastName: 'Organizer',
      phoneNumber: '0600000001',
    },
    {
      email: 'organizer2@seed.local',
      password: hashedPassword,
      role: Role.ORGANIZER,
      preferences: [Preference.THEATRE],
      name: 'Omar',
      lastName: 'Planner',
      phoneNumber: '0600000002',
    },
    {
      email: 'thomas@seed.local',
      password: hashedPassword,
      role: Role.CLIENT,
      preferences: [Preference.SPORT],
      name: 'Celine',
      lastName: 'Client',
      phoneNumber: '0600000003',
    },
    {
      email: 'client2@seed.local',
      password: hashedPassword,
      role: Role.CLIENT,
      preferences: [Preference.ART, Preference.FOOD],
      name: 'Claude',
      lastName: 'Client',
      phoneNumber: '0600000004',
    },
    {
      email: 'client3@seed.local',
      password: hashedPassword,
      role: Role.CLIENT,
      preferences: [Preference.EDUCATION],
      name: 'Camille',
      lastName: 'Client',
      phoneNumber: '0600000005',
    },
  ]);

  return repo.save(users);
}