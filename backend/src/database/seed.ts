import { DataSource } from 'typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';
import { ReservedSeat } from '../reservations/entities/reserved-seat.entity';
import { Payment } from '../payments/entities/payment.entity';
import { ReservationStatus, SeatStatus } from '../common/enums/reservation.enum';
import { PaymentMethod, PaymentStatus } from '../common/enums/payment.enum';

// Mock data for events (since we're not creating event entities)
const mockEvents = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Summer Music Festival 2026',
        date: new Date('2026-06-15'),
        location: 'Central Park Arena',
        totalSeats: 100,
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Tech Conference 2026',
        date: new Date('2026-03-20'),
        location: 'Convention Center',
        totalSeats: 200,
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Jazz Night',
        date: new Date('2026-04-10'),
        location: 'Blue Note Club',
        totalSeats: 50,
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Comedy Show Spectacular',
        date: new Date('2026-05-05'),
        location: 'Laugh Factory',
        totalSeats: 75,
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Classical Orchestra Performance',
        date: new Date('2026-07-22'),
        location: 'Symphony Hall',
        totalSeats: 150,
    },
];

// Mock users
const mockUsers = [
    '650e8400-e29b-41d4-a716-446655440001',
    '650e8400-e29b-41d4-a716-446655440002',
    '650e8400-e29b-41d4-a716-446655440003',
    '650e8400-e29b-41d4-a716-446655440004',
    '650e8400-e29b-41d4-a716-446655440005',
];

export async function seed(dataSource: DataSource) {
    console.log('🌱 Starting database seeding...');

    // COMPLETE DATABASE CLEANUP
    console.log('🗑️  Completely clearing database...');

    try {
        // Disable foreign key checks temporarily (if needed)
        // await dataSource.query('SET session_replication_role = replica;');

        // Drop tables in correct order (respecting foreign keys)
        await dataSource.query('DROP TABLE IF EXISTS "payments" CASCADE');
        await dataSource.query('DROP TABLE IF EXISTS "reserved_seats" CASCADE');
        await dataSource.query('DROP TABLE IF EXISTS "reservations" CASCADE');

        // Drop all enum types
        await dataSource.query('DROP TYPE IF EXISTS "reservations_status_enum" CASCADE');
        await dataSource.query('DROP TYPE IF EXISTS "reserved_seats_status_enum" CASCADE');
        await dataSource.query('DROP TYPE IF EXISTS "payments_method_enum" CASCADE');
        await dataSource.query('DROP TYPE IF EXISTS "payments_status_enum" CASCADE');

        console.log('✅ Successfully dropped all tables and types');

        // Re-enable foreign key checks (if disabled)
        // await dataSource.query('SET session_replication_role = DEFAULT;');
    } catch (error) {
        console.error('⚠️  Error during cleanup:', error.message);
        console.log('Continuing with synchronization...');
    }

    // Re-synchronize to create tables with correct enums
    console.log('🔄 Re-synchronizing database schema...');
    await dataSource.synchronize();
    console.log('✅ Schema synchronized successfully');

    const reservationRepo = dataSource.getRepository(Reservation);
    const reservedSeatRepo = dataSource.getRepository(ReservedSeat);
    const paymentRepo = dataSource.getRepository(Payment);

    const reservations: Reservation[] = [];
    const payments: Payment[] = [];

    // Create reservations for each event
    console.log('📝 Creating seed data...');
    // Create seats for each event first
    console.log('📝 Creating full seat maps for events...');
    for (const event of mockEvents) {
        const sections = [
            { name: 'Fosse Or', rows: 3, seatsPerRow: 15, price: 150 },
            { name: 'Catégorie 1', rows: 3, seatsPerRow: 15, price: 95 },
            { name: 'Balcon', rows: 3, seatsPerRow: 15, price: 65 }
        ];

        const allSeats: ReservedSeat[] = [];

        for (const section of sections) {
            for (let r = 1; r <= section.rows; r++) {
                const rowLabel = String.fromCharCode(64 + r);
                for (let n = 1; n <= section.seatsPerRow; n++) {
                    const seat = reservedSeatRepo.create({
                        eventId: event.id,
                        row: rowLabel,
                        number: n,
                        section: section.name,
                        category: section.name,
                        price: section.price,
                        status: SeatStatus.AVAILABLE,
                    });
                    allSeats.push(seat);
                }
            }
        }

        const savedEventSeats = await reservedSeatRepo.save(allSeats);
        console.log(`Created ${savedEventSeats.length} seats for event: ${event.name}`);

        // Now create some reservations for this event
        const numReservations = Math.floor(Math.random() * 5) + 5; // 5-10 reservations per event
        const availableSeats = [...savedEventSeats];

        for (let i = 0; i < numReservations; i++) {
            const numSeatsToBook = Math.floor(Math.random() * 4) + 1; // 1-4 seats per reservation
            if (availableSeats.length < numSeatsToBook) break;

            const selectedSeats = availableSeats.splice(0, numSeatsToBook);
            const userId = mockUsers[Math.floor(Math.random() * mockUsers.length)];
            const totalPrice = selectedSeats.reduce((sum, s) => sum + Number(s.price), 0);

            const status = [
                ReservationStatus.CONFIRMED,
                ReservationStatus.CONFIRMED,
                ReservationStatus.PENDING,
                ReservationStatus.CANCELLED,
            ][Math.floor(Math.random() * 4)];

            const reservation = reservationRepo.create({
                userId,
                eventId: event.id,
                totalPrice,
                status,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            });

            const savedReservation = await reservationRepo.save(reservation);
            reservations.push(savedReservation);

            // Update seats with reservation info
            for (const seat of selectedSeats) {
                seat.reservation = savedReservation;
                seat.reservationId = savedReservation.id;
                seat.status =
                    savedReservation.status === ReservationStatus.CONFIRMED
                        ? SeatStatus.SOLD
                        : savedReservation.status === ReservationStatus.PENDING
                            ? SeatStatus.LOCKED
                            : SeatStatus.AVAILABLE;
            }
            await reservedSeatRepo.save(selectedSeats);

            // Create payment
            if (status === ReservationStatus.CONFIRMED || status === ReservationStatus.PENDING) {
                const payment = paymentRepo.create({
                    userId,
                    reservationId: savedReservation.id,
                    amount: totalPrice,
                    method: Math.random() < 0.5 ? PaymentMethod.VISA : PaymentMethod.MASTERCARD,
                    status: status === ReservationStatus.CONFIRMED ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
                    cardLast4: Math.floor(1000 + Math.random() * 9000).toString(),
                });
                payments.push(await paymentRepo.save(payment));
            }
        }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`✅ Seeded ${mockEvents.length} mock events`);
    console.log(`✅ Seeded ${reservations.length} reservations`);
    console.log(`✅ Seeded ${await reservedSeatRepo.count()} reserved seats`);
    console.log(`✅ Seeded ${payments.length} payments`);
    console.log('🎉 Database seeding completed successfully!');
}