# 🎭 Frontend Mock Data Testing Guide

**Your frontend is now ready for testing WITHOUT the backend!**

## ✨ What's Included

✅ **5 Mock Events** - Concert data with real details  
✅ **600 Mock Seats** - Per-event with pricing & status  
✅ **Mock Reservations** - Create & confirm reservations  
✅ **Mock Payments** - Process payments successfully  
✅ **API-Ready Components** - Easy switch to real backend  

## 🚀 Getting Started

### 1. Start Frontend
```bash
cd frontend
npm install
npm run start
```

Access at **http://localhost:4200**

### 2. Mock Data is Enabled by Default
- No backend needed
- API calls return mock data with realistic delays
- Perfect for UI testing and user journey validation

### 3. Switch to Real Backend (When Ready)

**Option A: In Browser Console**
```javascript
// Get the ApiService
const apiService = ng.getComponent(document.querySelector('app-root')).injector.get(ApiService);

// Disable mock data and use real backend
apiService.setUseMockData(false);
// OR
apiService.setUseMockData(true);  // Re-enable mock data

// Check status
console.log(apiService.isMockDataEnabled()); // true = using mock
```

**Option B: In Code**
Edit `frontend/src/app/core/services/api.service.ts`:
```typescript
private useMockData = true;  // Change to false to use backend
```

## 📊 Mock Data Details

### Events (5 Total)
```
1. The Weeknd Concert - Feb 14, 2026
2. Taylor Swift Eras Tour - Mar 20, 2026
3. Coldplay Live - Apr 10, 2026
4. Billie Eilish Happier Tour - May 5, 2026
5. The Rolling Stones Celebration - Jun 15, 2026
```

### Seats per Event (~600 seats)
- **10 rows** × **15 seats per row** × **4 sections**
- **Sections**: Cat1 ($150), Cat2 ($100), Balcony ($75), Pit ($200)
- **Status**: ~80% available, ~20% sold

### Realistic Delays
- Events list: 300ms
- Single event: 200ms
- Seats list: 400ms
- Lock seats: 500ms
- Process payment: 800ms

## 🧪 Testing Scenarios

### Scenario 1: Browse Events
1. Page loads → Lists 5 mock events
2. Click event → Details with seat preview
3. No backend API calls needed ✅

### Scenario 2: Select Seats
1. Choose event → See all 600 mock seats
2. Click seats to lock them → Cart updates
3. Total price calculated with service fees ✅

### Scenario 3: Complete Payment
1. Enter dummy payment info:
   - Card Name: **John Doe**
   - Card Number: **4111111111111111**
   - Expiry: **12/25**
   - CVV: **123**
   - Email: **test@example.com**
2. Submit → Mock payment succeeds ✅

### Scenario 4: View Confirmation
1. See confirmation page with:
   - Event details
   - Selected seats
   - Total amount paid
   - Mock QR code ✅

## 📝 Mock Data File

**Location**: `frontend/src/app/core/services/mock-data.service.ts`

```typescript
// Key methods:
- getEvents(): Event[]
- getEventById(id: string): Event
- getSeatsByEventId(eventId: string): Seat[]
- createReservation(eventId, seatIds): Reservation
- confirmReservation(reservationId): Reservation
```

## 🔌 API Integration Points

All components remain **100% API-ready**. When backend is available:

```typescript
// Components still call the same endpoints:
apiService.get<Event[]>('events')                    // ✅ Works
apiService.get<Event>(`events/${id}`)                // ✅ Works
apiService.get<Seat[]>(`seats/event/${eventId}`)    // ✅ Works
apiService.post('reservations/lock', data)           // ✅ Works
apiService.post('payments/process', data)            // ✅ Works
apiService.patch(`reservations/${id}/confirm`, data) // ✅ Works
```

No component code changes needed - just disable mock data!

## 🎯 Using Real Backend

### When Backend is Running
```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Database (Docker)
docker-compose up postgres

# Terminal 3: Frontend
cd frontend
npm run start
```

### Disable Mock Data
```javascript
// In browser console
const apiService = ng.getComponent(document.querySelector('app-root')).injector.get(ApiService);
apiService.setUseMockData(false);
```

### Or in code
Edit `api.service.ts`:
```typescript
private useMockData = false; // ← Change this
```

Now all API calls go to **http://localhost:3000** ✅

## 🐛 Debugging

### View API Calls
```javascript
// In browser console
const apiService = ng.getComponent(document.querySelector('app-root')).injector.get(ApiService);
apiService.isMockDataEnabled(); // Returns true/false
```

### Check Mock Data
```javascript
// Inspect what mock data returns
const mockService = ng.getComponent(document.querySelector('app-root')).injector.get(MockDataService);
mockService.getEvents();
mockService.getSeatsByEventId('1');
```

### Network Tab
- **With Mock Data**: No network requests to backend
- **Without Mock Data**: All requests go to http://localhost:3000

## ✅ Testing Checklist

- [ ] Events list loads with 5 events
- [ ] Click event shows details & seats
- [ ] Select seats → cart updates
- [ ] Calculated pricing with fees
- [ ] Payment form validates
- [ ] Mock payment succeeds
- [ ] Confirmation page displays
- [ ] Timer counts down correctly
- [ ] Error handling works
- [ ] Can switch to real backend

## 🔄 Component Status

All components use **modern Angular patterns**:
- ✅ No OnInit/OnDestroy lifecycle hooks
- ✅ Pure signals & effects
- ✅ Computed values for derived state
- ✅ Full type safety

## 📦 File Structure

```
frontend/src/app/core/services/
├── api.service.ts              ← Mock data enabled here
├── mock-data.service.ts         ← 5 events + seats
├── mock-data-toggle.ts          ← Helper for switching
├── event.service.ts             ← Calls api.service.ts
├── seat.service.ts              ← Calls api.service.ts
├── reservation.service.ts       ← Calls api.service.ts
└── payment.service.ts           ← Calls api.service.ts
```

## 🎉 Ready to Test!

```bash
npm run start
# Navigate to http://localhost:4200
# Browse events, select seats, pay, confirm!
```

**No backend required!** Everything works with mock data. Switch to real backend whenever ready.

---

**Questions?**
- Check `mock-data.service.ts` for data structure
- Check `api.service.ts` for mock intercept logic
- Open browser console and inspect `apiService.isMockDataEnabled()`
