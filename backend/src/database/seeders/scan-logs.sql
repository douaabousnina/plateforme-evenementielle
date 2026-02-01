-- SQL Commands to populate scan_logs table with test data
-- This demonstrates various scan statuses: valid, already_scanned, expired, invalid, and fake

-- Clear existing scan logs (optional - be careful in production!)
-- DELETE FROM scan_logs;

-- Sample data for multiple events and tickets
INSERT INTO scan_logs (id, "ticketId", "eventId", "eventName", "scannedBy", "scannedAt", "timestamp", status, location, "deviceInfo") VALUES

-- Event 1: Music Festival 2024 - Valid scans
('550e8400-e29b-41d4-a716-446655440001', 'TICKET-001', 'EVENT-001', 'Festival de Musique 2024', 'USER-CONTROLLER-1', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 'valid', 'Entrée Principale', 'Device: iPhone 14 Pro'),
('550e8400-e29b-41d4-a716-446655440002', 'TICKET-002', 'EVENT-001', 'Festival de Musique 2024', 'USER-CONTROLLER-1', NOW() - INTERVAL '2 days 1 hour', NOW() - INTERVAL '2 days 1 hour', 'valid', 'Entrée Principale', 'Device: Samsung S23'),
('550e8400-e29b-41d4-a716-446655440003', 'TICKET-003', 'EVENT-001', 'Festival de Musique 2024', 'USER-CONTROLLER-2', NOW() - INTERVAL '2 days 3 hours', NOW() - INTERVAL '2 days 3 hours', 'valid', 'Entrée VIP', 'Device: iPad Air'),
('550e8400-e29b-41d4-a716-446655440004', 'TICKET-004', 'EVENT-001', 'Festival de Musique 2024', 'USER-CONTROLLER-2', NOW() - INTERVAL '2 days 5 hours', NOW() - INTERVAL '2 days 5 hours', 'valid', 'Entrée Principale', 'Device: iPhone 13'),

-- Event 1: Already scanned (repeated attempts)
('550e8400-e29b-41d4-a716-446655440005', 'TICKET-001', 'EVENT-001', 'Festival de Musique 2024', 'USER-CONTROLLER-1', NOW() - INTERVAL '2 days 30 minutes', NOW() - INTERVAL '2 days 30 minutes', 'already_scanned', 'Entrée Principale', 'Device: iPhone 14 Pro'),
('550e8400-e29b-41d4-a716-446655440006', 'TICKET-002', 'EVENT-001', 'Festival de Musique 2024', 'USER-CONTROLLER-3', NOW() - INTERVAL '1 day 22 hours', NOW() - INTERVAL '1 day 22 hours', 'already_scanned', 'Entrée VIP', 'Device: Pixel 7'),

-- Event 1: Fake/Invalid tickets
('550e8400-e29b-41d4-a716-446655440007', 'TICKET-FAKE-001', 'EVENT-001', 'Festival de Musique 2024', 'USER-CONTROLLER-2', NOW() - INTERVAL '1 day 18 hours', NOW() - INTERVAL '1 day 18 hours', 'fake', 'Entrée Principale', 'Device: iPhone 12'),
('550e8400-e29b-41d4-a716-446655440008', 'TICKET-INVALID-001', 'EVENT-001', 'Festival de Musique 2024', 'USER-CONTROLLER-1', NOW() - INTERVAL '1 day 16 hours', NOW() - INTERVAL '1 day 16 hours', 'invalid', 'Entrée Principale', 'Device: Samsung A52'),

-- Event 1: Expired tickets
('550e8400-e29b-41d4-a716-446655440009', 'TICKET-EXPIRED-001', 'EVENT-001', 'Festival de Musique 2024', 'USER-CONTROLLER-3', NOW() - INTERVAL '1 day 14 hours', NOW() - INTERVAL '1 day 14 hours', 'expired', 'Entrée VIP', 'Device: OnePlus 11'),

-- Event 2: Concert - Jazz Night - Valid scans
('550e8400-e29b-41d4-a716-446655440010', 'TICKET-JAZZ-001', 'EVENT-002', 'Jazz Night 2024', 'USER-CONTROLLER-1', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'valid', 'Entrée Principale', 'Device: iPhone 15 Pro'),
('550e8400-e29b-41d4-a716-446655440011', 'TICKET-JAZZ-002', 'EVENT-002', 'Jazz Night 2024', 'USER-CONTROLLER-2', NOW() - INTERVAL '23 hours 45 minutes', NOW() - INTERVAL '23 hours 45 minutes', 'valid', 'Entrée VIP', 'Device: iPad Pro'),
('550e8400-e29b-41d4-a716-446655440012', 'TICKET-JAZZ-003', 'EVENT-002', 'Jazz Night 2024', 'USER-CONTROLLER-1', NOW() - INTERVAL '23 hours 30 minutes', NOW() - INTERVAL '23 hours 30 minutes', 'valid', 'Entrée Principale', 'Device: Samsung S24'),

-- Event 2: Already scanned in Jazz Night
('550e8400-e29b-41d4-a716-446655440013', 'TICKET-JAZZ-002', 'EVENT-002', 'Jazz Night 2024', 'USER-CONTROLLER-3', NOW() - INTERVAL '23 hours 15 minutes', NOW() - INTERVAL '23 hours 15 minutes', 'already_scanned', 'Entrée VIP', 'Device: Pixel 8 Pro'),

-- Event 2: Invalid tickets
('550e8400-e29b-41d4-a716-446655440014', 'TICKET-JAZZ-FAKE-001', 'EVENT-002', 'Jazz Night 2024', 'USER-CONTROLLER-2', NOW() - INTERVAL '22 hours', NOW() - INTERVAL '22 hours', 'fake', 'Entrée Principale', 'Device: iPhone 14'),

-- Event 3: Sports Tournament - Valid scans
('550e8400-e29b-41d4-a716-446655440015', 'TICKET-SPORT-001', 'EVENT-003', 'Tournoi de Football 2024', 'USER-CONTROLLER-1', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours', 'valid', 'Portail Nord', 'Device: Samsung S22'),
('550e8400-e29b-41d4-a716-446655440016', 'TICKET-SPORT-002', 'EVENT-003', 'Tournoi de Football 2024', 'USER-CONTROLLER-3', NOW() - INTERVAL '11 hours 50 minutes', NOW() - INTERVAL '11 hours 50 minutes', 'valid', 'Portail Sud', 'Device: OnePlus 12'),
('550e8400-e29b-41d4-a716-446655440017', 'TICKET-SPORT-003', 'EVENT-003', 'Tournoi de Football 2024', 'USER-CONTROLLER-2', NOW() - INTERVAL '11 hours 30 minutes', NOW() - INTERVAL '11 hours 30 minutes', 'valid', 'Portail Est', 'Device: iPhone 13 Pro Max'),
('550e8400-e29b-41d4-a716-446655440018', 'TICKET-SPORT-004', 'EVENT-003', 'Tournoi de Football 2024', 'USER-CONTROLLER-1', NOW() - INTERVAL '11 hours 10 minutes', NOW() - INTERVAL '11 hours 10 minutes', 'valid', 'Portail Nord', 'Device: Pixel 7 Pro'),
('550e8400-e29b-41d4-a716-446655440019', 'TICKET-SPORT-005', 'EVENT-003', 'Tournoi de Football 2024', 'USER-CONTROLLER-3', NOW() - INTERVAL '10 hours 50 minutes', NOW() - INTERVAL '10 hours 50 minutes', 'valid', 'Portail Ouest', 'Device: Samsung A71'),

-- Event 3: Multiple invalid attempts
('550e8400-e29b-41d4-a716-446655440020', 'TICKET-SPORT-001', 'EVENT-003', 'Tournoi de Football 2024', 'USER-CONTROLLER-2', NOW() - INTERVAL '10 hours 30 minutes', NOW() - INTERVAL '10 hours 30 minutes', 'already_scanned', 'Portail Nord', 'Device: iPhone 13 Pro Max'),
('550e8400-e29b-41d4-a716-446655440021', 'TICKET-SPORT-FAKE-001', 'EVENT-003', 'Tournoi de Football 2024', 'USER-CONTROLLER-1', NOW() - INTERVAL '10 hours', NOW() - INTERVAL '10 hours', 'fake', 'Portail Nord', 'Device: Xiaomi 13'),
('550e8400-e29b-41d4-a716-446655440022', 'TICKET-SPORT-INVALID-001', 'EVENT-003', 'Tournoi de Football 2024', 'USER-CONTROLLER-3', NOW() - INTERVAL '9 hours 45 minutes', NOW() - INTERVAL '9 hours 45 minutes', 'invalid', 'Portail Sud', 'Device: Samsung S23 Ultra'),
('550e8400-e29b-41d4-a716-446655440023', 'TICKET-SPORT-EXPIRED-001', 'EVENT-003', 'Tournoi de Football 2024', 'USER-CONTROLLER-2', NOW() - INTERVAL '9 hours 30 minutes', NOW() - INTERVAL '9 hours 30 minutes', 'expired', 'Portail Est', 'Device: iPhone 14 Pro'),

-- Event 4: Theater Show - Recent scans with mix of statuses
('550e8400-e29b-41d4-a716-446655440024', 'TICKET-THEATER-001', 'EVENT-004', 'Pièce de Théâtre - Hamlet', 'USER-CONTROLLER-1', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours', 'valid', 'Entrée Principale', 'Device: iPhone 15'),
('550e8400-e29b-41d4-a716-446655440025', 'TICKET-THEATER-002', 'EVENT-004', 'Pièce de Théâtre - Hamlet', 'USER-CONTROLLER-2', NOW() - INTERVAL '2 hours 55 minutes', NOW() - INTERVAL '2 hours 55 minutes', 'valid', 'Entrée VIP', 'Device: iPad Mini'),
('550e8400-e29b-41d4-a716-446655440026', 'TICKET-THEATER-003', 'EVENT-004', 'Pièce de Théâtre - Hamlet', 'USER-CONTROLLER-3', NOW() - INTERVAL '2 hours 45 minutes', NOW() - INTERVAL '2 hours 45 minutes', 'valid', 'Entrée Principale', 'Device: Samsung S24 Plus'),
('550e8400-e29b-41d4-a716-446655440027', 'TICKET-THEATER-001', 'EVENT-004', 'Pièce de Théâtre - Hamlet', 'USER-CONTROLLER-1', NOW() - INTERVAL '2 hours 30 minutes', NOW() - INTERVAL '2 hours 30 minutes', 'already_scanned', 'Entrée Principale', 'Device: iPhone 15'),
('550e8400-e29b-41d4-a716-446655440028', 'TICKET-THEATER-FAKE-001', 'EVENT-004', 'Pièce de Théâtre - Hamlet', 'USER-CONTROLLER-2', NOW() - INTERVAL '2 hours 15 minutes', NOW() - INTERVAL '2 hours 15 minutes', 'fake', 'Entrée Principale', 'Device: Pixel 8'),
('550e8400-e29b-41d4-a716-446655440029', 'TICKET-THEATER-INVALID-001', 'EVENT-004', 'Pièce de Théâtre - Hamlet', 'USER-CONTROLLER-3', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', 'invalid', 'Entrée VIP', 'Device: OnePlus 12 Pro'),

-- Event 5: Conference - More varied data
('550e8400-e29b-41d4-a716-446655440030', 'TICKET-CONF-001', 'EVENT-005', 'Tech Conference 2024', 'USER-CONTROLLER-1', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', 'valid', 'Hall A', 'Device: iPhone 14 Pro Max'),
('550e8400-e29b-41d4-a716-446655440031', 'TICKET-CONF-002', 'EVENT-005', 'Tech Conference 2024', 'USER-CONTROLLER-2', NOW() - INTERVAL '55 minutes', NOW() - INTERVAL '55 minutes', 'valid', 'Hall A', 'Device: MacBook Pro'),
('550e8400-e29b-41d4-a716-446655440032', 'TICKET-CONF-003', 'EVENT-005', 'Tech Conference 2024', 'USER-CONTROLLER-3', NOW() - INTERVAL '50 minutes', NOW() - INTERVAL '50 minutes', 'valid', 'Hall B', 'Device: Samsung Tablet'),
('550e8400-e29b-41d4-a716-446655440033', 'TICKET-CONF-001', 'EVENT-005', 'Tech Conference 2024', 'USER-CONTROLLER-1', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes', 'already_scanned', 'Hall A', 'Device: iPhone 14 Pro Max'),
('550e8400-e29b-41d4-a716-446655440034', 'TICKET-CONF-EXPIRED-001', 'EVENT-005', 'Tech Conference 2024', 'USER-CONTROLLER-2', NOW() - INTERVAL '40 minutes', NOW() - INTERVAL '40 minutes', 'expired', 'Hall A', 'Device: Pixel 7a');

-- Summary statistics query to verify data
-- SELECT 
--   "eventName" as "Événement",
--   status as "Statut",
--   COUNT(*) as "Nombre de scans"
-- FROM scan_logs
-- GROUP BY "eventName", status
-- ORDER BY "eventName", status;

-- More detailed query showing all columns
-- SELECT * FROM scan_logs ORDER BY "scannedAt" DESC LIMIT 50;
