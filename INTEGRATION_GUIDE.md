# Backend Integration & Database Seeding Guide

## Overview

The ticket booking application is now fully integrated with:
- **Backend**: NestJS REST API on port 3000
- **Database**: PostgreSQL for persistent data
- **Frontend**: Angular 21 on port 4200
- **Seeding**: Automatic mock data generation on startup

## Architecture

### Backend Modules

#### Events Module (`/backend/src/events/`)
- **EventsService**: Manages events and database seeding
- **EventsController**: REST endpoints for events
- **SeatsService**: Manages seat generation and availability
- **SeatsController**: REST endpoints for seats
- **Event Entity**: Database model for events
- **Seat Entity**: Database model for seats

#### Reservations Module (`/backend/src/reservations/`)
- Handles seat locking, reservation confirmation, and cancellation
- Manages reservation lifecycle
- Integrates with payments

#### Payments Module (`/backend/src/payments/`)
- Processes payment requests
- Handles payment confirmations and refunds

### Frontend Services

#### EventService (`/frontend/src/app/core/services/`)
```typescript
- getEventById(id: string)     // Fetch single event
- getAllEvents()                // Fetch all events
- getCurrentEvent()             // Get cached event
```

#### SeatService
```typescript
- getSeatsByEventId(eventId)   // Fetch seats for event
- updateSeatStatus()            // Update seat status
- getCurrentSeats()             // Get cached seats
```

#### ReservationService
```typescript
- lockSeats()                   // Lock seats for reservation
- confirmReservation()          // Confirm after payment
- cancelReservation()           // Cancel reservation
- getReservation()              // Get reservation details
```

#### PaymentService
```typescript
- processPayment()              // Process payment via backend
- refundPayment()               // Request refund
- getPaymentStatus()            // Check payment status
```

## Database Schema

### Events Table
```sql
id              UUID PRIMARY KEY
name            VARCHAR
description     TEXT
date            TIMESTAMP
location        VARCHAR
totalSeats      INTEGER
availableSeats  INTEGER
sections        TEXT[]
imageUrl        VARCHAR
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

### Seats Table
```sql
id              UUID PRIMARY KEY
eventId         UUID FOREIGN KEY
seatNumber      VARCHAR (e.g., "A1")
row             VARCHAR (e.g., "A")
section         VARCHAR (e.g., "Cat1")
price           DECIMAL(10,2)
status          ENUM (AVAILABLE, LOCKED, RESERVED, SOLD)
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

### Reservations Table
```sql
id              UUID PRIMARY KEY
userId          VARCHAR
eventId         UUID FOREIGN KEY
status          ENUM (PENDING, CONFIRMED, CANCELLED)
totalPrice      DECIMAL(10,2)
createdAt       TIMESTAMP
expiresAt       TIMESTAMP
```

### Payments Table
```sql
id              UUID PRIMARY KEY
reservationId   UUID FOREIGN KEY
amount          DECIMAL(10,2)
currency        VARCHAR
status          ENUM (PENDING, SUCCESS, FAILED)
transactionId   VARCHAR
confirmationCode VARCHAR
```

## Mock Data

### Auto-Seeded Events (5 Total)

1. **The Weeknd Concert** (June 15, 2024)
   - Venue: Madison Square Garden
   - Capacity: 20,000 seats
   - Sections: Cat1, Cat2, Balcony
   - Pricing: Cat1 $150, Cat2 $100, Balcony $75

2. **Taylor Swift Eras Tour** (July 22, 2024)
   - Venue: MetLife Stadium
   - Capacity: 82,500 seats
   - Sections: Cat1, Cat2, Balcony, Pit
   - Pricing: Cat1 $150, Cat2 $100, Balcony $75, Pit $200

3. **Coldplay Live** (August 10, 2024)
   - Venue: Soldier Field
   - Capacity: 61,500 seats
   - Sections: Cat1, Cat2, Balcony
   - Pricing: Cat1 $150, Cat2 $100, Balcony $75

4. **Billie Eilish Tour** (September 5, 2024)
   - Venue: Crypto.com Arena
   - Capacity: 20,000 seats
   - Sections: Cat1, Cat2, Balcony
   - Pricing: Cat1 $150, Cat2 $100, Balcony $75

5. **The Rolling Stones** (October 12, 2024)
   - Venue: Oracle Park
   - Capacity: 41,915 seats
   - Sections: Cat1, Cat2, Balcony
   - Pricing: Cat1 $150, Cat2 $100, Balcony $75

**Total Seats Generated**: ~226,000 seats across all events

## API Endpoints

### Events
```
GET    /events              - List all events
GET    /events/:id          - Get single event
```

### Seats
```
GET    /seats/event/:id     - Get seats for event
GET    /seats/:id           - Get single seat
```

### Reservations
```
POST   /reservations/lock               - Lock seats (create reservation)
PATCH  /reservations/:id/confirm        - Confirm reservation
PATCH  /reservations/:id/cancel         - Cancel reservation
GET    /reservations/:id                - Get reservation details
GET    /reservations/user/:userId       - Get user's reservations
```

### Payments
```
POST   /payments/process    - Process payment
POST   /payments/refund     - Request refund
GET    /payments/:id        - Get payment status
```

## User Flow Integration

### 1. Seat Selection (`/seat-selection`)
```typescript
// Component loads event from route params
effect(() => {
  const id = this.eventId();
  this.loadEventAndSeats(id);
});

// Services used:
- EventService.getEventById()
- SeatService.getSeatsByEventId()
```

### 2. Seat Interaction
```typescript
// User selects seats from the interactive map
- Selected seats stored in component signal
- Total price calculated from seat prices
- Cart summary updates dynamically
```

### 3. Lock Seats
```typescript
// User proceeds to payment
reservationId = await ReservationService.lockSeats({
  eventId,
  seatIds: selectedSeats.map(s => s.id)
});

// Navigation to payment page with reservationId
```

### 4. Payment (`/payment`)
```typescript
// Load reservation details
effect(() => {
  ReservationService.getReservation(reservationId)
    .subscribe(data => reservation.set(data));
});

// Process payment
PaymentService.processPayment({
  reservationId,
  amount: total(),
  contactInfo,
  paymentMethod
}).subscribe(response => {
  // Confirm reservation
  ReservationService.confirmReservation(reservationId)
    .subscribe(() => navigate('/confirmation', { state: response }));
});
```

### 5. Confirmation (`/confirmation`)
```typescript
// Display reservation and payment confirmation
effect(() => {
  const state = router.getCurrentNavigation().extras.state;
  reservation.set(state.reservation);
  confirmationCode.set(state.confirmationCode);
});
```

## Running the Application

### Using Docker (Recommended)

```bash
# From project root
docker-compose up

# Services will be available at:
# Frontend:   http://localhost:4200
# Backend:    http://localhost:3000
# Database:   localhost:5431
```

### Local Development

```bash
# Terminal 1: Backend
cd backend
npm install
npm run start:dev
# Backend runs on http://localhost:3000

# Terminal 2: Frontend
cd frontend
npm install
npm run start
# Frontend runs on http://localhost:4200

# Terminal 3: PostgreSQL
# Make sure PostgreSQL is running and accessible
# Default credentials in .env file
```

### Database Setup

The database is automatically seeded on backend startup with:
- 5 mock events
- All seats for each event
- Event pricing and seating configurations

**Database Connection**: PostgreSQL 17
- Host: `postgres` (Docker) or `localhost:5431` (local)
- Database: `ticket_booking`
- User: `postgres`
- Password: `postgres` (set in .env)

## Modern Angular Features Used

### Signals & Reactivity
- `signal()`: State management
- `computed()`: Derived state
- `effect()`: Side effects (replaces OnInit/OnDestroy)

### No Lifecycle Hooks
- All page components use `effect()` instead of `OnInit`/`OnDestroy`
- Automatic cleanup with signal subscriptions
- Cleaner, more declarative code

### Reactive Services
- Observable-based API calls
- Signal wrappers for state
- Computed signals for derived values

### Router State
- Navigation with state passing
- Type-safe data flow between pages
- No string-based state management

## Error Handling

All services include error handling:
- Network errors caught and propagated
- User-friendly error messages
- Error state signals for UI display
- Retry logic in critical paths

## Security Considerations

### Currently Implemented
- CORS enabled for localhost:4200
- Type safety via TypeScript strict mode
- Input validation in DTOs

### TODO (Production Ready)
- JWT authentication on auth context
- API key management
- Request signing
- Rate limiting
- SQL injection prevention via ORM
- HTTPS enforcement

## Performance Optimizations

- HTTP caching via ETag headers
- Seat data cached in signals
- Computed signals prevent recalculation
- Effect-based cleanup prevents memory leaks
- Docker health checks for container reliability

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# View backend logs
docker logs nest-backend

# Reset database
docker-compose down -v
docker-compose up
```

### Frontend Cannot Connect to Backend
```bash
# Verify backend is running on port 3000
curl http://localhost:3000

# Check CORS configuration in main.ts
# Should allow http://localhost:4200
```

### No Mock Data Seeding
```bash
# Check backend logs for seed messages
docker logs nest-backend | grep "Seeding\|Seeded"

# Verify database has events
docker exec postgres psql -U postgres -d ticket_booking -c "SELECT COUNT(*) FROM events;"
```

## Next Steps for Production

1. **Authentication**: Implement JWT token-based auth
2. **Payment Gateway**: Integrate real payment processor (Stripe, PayPal)
3. **Email Notifications**: Send confirmation emails
4. **QR Code Generation**: Generate actual QR codes for tickets
5. **Admin Panel**: Create management interface for events
6. **Analytics**: Track user behavior and sales
7. **Caching Layer**: Add Redis for performance
8. **Load Testing**: Test at scale
9. **Deployment**: Docker Swarm or Kubernetes
10. **Monitoring**: Logging and alerting infrastructure

---

**Status**: ✅ Backend integration complete | ✅ Database seeding active | ✅ Frontend services configured | ✅ API endpoints integrated
