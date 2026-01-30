import { DataSource } from 'typeorm';
import { clearAll } from './clear-all';
import { seedUsers } from './seed-users';
import { seedLocations } from './seed-locations';
import { seedEvents } from './seed-events';
import { seedSeats } from './seed-seats';
import { seedReservations } from './seed-reservations';
import { seedPayments } from './seed-payments';
import { seedTickets, seedScanLogs } from './seed-access';

export async function seed(dataSource: DataSource): Promise<void> {
  console.log('🌱 Starting database seeding...');

  console.log('🗑️  Clearing existing data...');
  await clearAll(dataSource);
  console.log('✅ Cleared.');

  console.log('👤 Seeding users...');
  const users = await seedUsers(dataSource);
  console.log(`   Created ${users.length} users.`);

  console.log('📍 Seeding locations...');
  const locations = await seedLocations(dataSource);
  console.log(`   Created ${locations.length} locations.`);

  console.log('📅 Seeding events...');
  const events = await seedEvents(dataSource, locations, users);
  console.log(`   Created ${events.length} events.`);

  console.log('💺 Seeding seats...');
  const seats = await seedSeats(dataSource, events);
  console.log(`   Created ${seats.length} seats.`);

  console.log('📝 Seeding reservations...');
  const { reservations } = await seedReservations(dataSource, events, users);
  console.log(`   Created ${reservations.length} reservations.`);

  console.log('💳 Seeding payments...');
  const payments = await seedPayments(dataSource, reservations);
  console.log(`   Created ${payments.length} payments.`);

  console.log('🎫 Seeding tickets...');
  const tickets = await seedTickets(dataSource, reservations, events);
  console.log(`   Created ${tickets.length} tickets.`);

  console.log('📋 Seeding scan logs...');
  const scanLogs = await seedScanLogs(
    dataSource,
    tickets.slice(0, 3).map((t) => t.id),
  );
  console.log(`   Created ${scanLogs.length} scan logs.`);

  console.log('\n📊 Seeding summary:');
  console.log(`   Users: ${users.length}`);
  console.log(`   Locations: ${locations.length}`);
  console.log(`   Events: ${events.length}`);
  console.log(`   Seats: ${seats.length}`);
  console.log(`   Reservations: ${reservations.length}`);
  console.log(`   Payments: ${payments.length}`);
  console.log(`   Tickets: ${tickets.length}`);
  console.log(`   Scan logs: ${scanLogs.length}`);
  console.log('🎉 Database seeding completed successfully.');
}
