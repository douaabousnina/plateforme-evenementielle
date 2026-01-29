-- Clear existing data
TRUNCATE TABLE scan_logs CASCADE;
TRUNCATE TABLE tickets CASCADE;

-- Insert Tickets
INSERT INTO tickets (id, "eventId", "eventName", "eventDate", "eventLocation", "eventImage", "userId", "orderId", "qrCode", "qrToken", gate, row, seat, zone, access, category, price, status, "createdAt", "expiresAt") VALUES
-- Coldplay - Music of the Spheres (user-123 tickets)
('d312c8bc-8c4e-4aae-bc55-5d5e3d4f8e2a', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', '2025-06-15 20:00:00', 'Stade de France, Paris', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', 'user-123', 'order-coldplay-001', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-coldplay-001', 'Gate A', 'Row 12', 'Seat 5', 'Standing', 'VIP', 'Premium', 89.99, 'confirmed', NOW() - INTERVAL '30 days', NOW() + INTERVAL '150 days'),

('a1b2c3d4-5e6f-4a8b-9c0d-e1f2a3b4c5d6', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', '2025-06-15 20:00:00', 'Stade de France, Paris', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', 'user-123', 'order-coldplay-002', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-coldplay-002', 'Gate B', 'Row 8', 'Seat 12', 'Seated', 'General', 'Standard', 65.00, 'confirmed', NOW() - INTERVAL '25 days', NOW() + INTERVAL '150 days'),

-- Web Summit 2025 (user-123 tickets)
('d30503f6-5f0e-4c5d-8a9b-2e1f5a6d7c8b', 'evt-websummit-2025', 'Web Summit 2025', '2025-11-04 09:00:00', 'Altice Arena, Lisbon', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'user-123', 'order-websummit-001', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-websummit-001', 'Hall A', NULL, NULL, 'Conference', 'All Access', '3-Day Pass', 299.00, 'confirmed', NOW() - INTERVAL '60 days', NOW() + INTERVAL '300 days'),

('b2c3d4e5-6f7a-4b9c-8d0e-f1a2b3c4d5e6', 'evt-websummit-2025', 'Web Summit 2025', '2025-11-04 09:00:00', 'Altice Arena, Lisbon', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'user-123', 'order-websummit-002', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-websummit-002', 'Hall B', NULL, NULL, 'Conference', 'General', '1-Day Pass', 149.00, 'confirmed', NOW() - INTERVAL '55 days', NOW() + INTERVAL '300 days'),

-- Le Roi Lion (user-123 tickets)
('febe8f71-3d2e-4b1a-9c8d-7e6f5a4b3c2d', 'evt-roilion-2025', 'Le Roi Lion', '2025-03-20 19:30:00', 'Théâtre Mogador, Paris', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', 'user-123', 'order-roilion-001', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-roilion-001', 'Main Entrance', 'Orchestre', '15', 'Orchestra', 'Standard', 'Premium', 125.00, 'confirmed', NOW() - INTERVAL '45 days', NOW() + INTERVAL '60 days'),

('c3d4e5f6-7a8b-4c9d-8e0f-a1b2c3d4e5f6', 'evt-roilion-2025', 'Le Roi Lion', '2025-03-20 19:30:00', 'Théâtre Mogador, Paris', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', 'user-other', 'order-roilion-002', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-roilion-002', 'Main Entrance', 'Balcon', '8', 'Balcony', 'Standard', 'Standard', 85.00, 'confirmed', NOW() - INTERVAL '40 days', NOW() + INTERVAL '60 days'),

-- Fake/Test Tickets
('11111111-2222-4333-8444-555555555001', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', '2025-06-15 20:00:00', 'Stade de France, Paris', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', 'user-fake-001', 'order-fake-001', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-fake-001', 'Gate C', 'Row 20', 'Seat 15', 'Standing', 'General', 'Standard', 55.00, 'confirmed', NOW() - INTERVAL '20 days', NOW() + INTERVAL '150 days'),

('11111111-2222-4333-8444-555555555002', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', '2025-06-15 20:00:00', 'Stade de France, Paris', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', 'user-fake-002', 'order-fake-002', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-fake-002', 'Gate D', 'Row 15', 'Seat 8', 'Seated', 'VIP', 'Premium', 99.00, 'confirmed', NOW() - INTERVAL '18 days', NOW() + INTERVAL '150 days'),

('11111111-2222-4333-8444-555555555003', 'evt-websummit-2025', 'Web Summit 2025', '2025-11-04 09:00:00', 'Altice Arena, Lisbon', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'user-fake-003', 'order-fake-003', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-fake-003', 'Hall C', NULL, NULL, 'Conference', 'General', '1-Day Pass', 149.00, 'confirmed', NOW() - INTERVAL '50 days', NOW() + INTERVAL '300 days'),

('11111111-2222-4333-8444-555555555004', 'evt-websummit-2025', 'Web Summit 2025', '2025-11-04 09:00:00', 'Altice Arena, Lisbon', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'user-fake-004', 'order-fake-004', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-fake-004', 'Hall D', NULL, NULL, 'Conference', 'General', '2-Day Pass', 249.00, 'cancelled', NOW() - INTERVAL '48 days', NOW() + INTERVAL '300 days'),

('11111111-2222-4333-8444-555555555005', 'evt-roilion-2025', 'Le Roi Lion', '2025-03-20 19:30:00', 'Théâtre Mogador, Paris', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', 'user-fake-005', 'order-fake-005', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-fake-005', 'Main Entrance', 'Balcon', '12', 'Balcony', 'Standard', 'Standard', 85.00, 'confirmed', NOW() - INTERVAL '35 days', NOW() + INTERVAL '60 days'),

('11111111-2222-4333-8444-555555555006', 'evt-roilion-2025', 'Le Roi Lion', '2025-03-20 19:30:00', 'Théâtre Mogador, Paris', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', 'user-fake-006', 'order-fake-006', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'token-fake-006', 'Main Entrance', 'Orchestre', '22', 'Orchestra', 'Standard', 'Premium', 125.00, 'pending', NOW() - INTERVAL '32 days', NOW() + INTERVAL '60 days');

-- Insert Scan Logs
INSERT INTO scan_logs ("ticketId", "eventId", "eventName", "scannedBy", "scannedAt", timestamp, status, location) VALUES
-- Coldplay Scans
('d312c8bc-8c4e-4aae-bc55-5d5e3d4f8e2a', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', 'Jean Dupont', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', 'valid', 'Entrée Principale'),
('d312c8bc-8c4e-4aae-bc55-5d5e3d4f8e2a', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', 'Marie Martin', NOW() - INTERVAL '1 hour 50 minutes', NOW() - INTERVAL '1 hour 50 minutes', 'already_scanned', 'Entrée VIP'),
('11111111-2222-4333-8444-555555555001', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', 'Jean Dupont', NOW() - INTERVAL '2 hours 30 minutes', NOW() - INTERVAL '2 hours 30 minutes', 'valid', 'Entrée Principale'),
('11111111-2222-4333-8444-555555555002', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', 'Marie Martin', NOW() - INTERVAL '2 hours 15 minutes', NOW() - INTERVAL '2 hours 15 minutes', 'valid', 'Entrée VIP'),

-- Web Summit Scans
('d30503f6-5f0e-4c5d-8a9b-2e1f5a6d7c8b', 'evt-websummit-2025', 'Web Summit 2025', 'Pierre Leroy', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours', 'valid', 'Hall A'),
('d30503f6-5f0e-4c5d-8a9b-2e1f5a6d7c8b', 'evt-websummit-2025', 'Web Summit 2025', 'Sophie Bernard', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours', 'already_scanned', 'Hall B'),
('d30503f6-5f0e-4c5d-8a9b-2e1f5a6d7c8b', 'evt-websummit-2025', 'Web Summit 2025', 'Luc Moreau', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', 'already_scanned', 'Networking Zone'),
('11111111-2222-4333-8444-555555555003', 'evt-websummit-2025', 'Web Summit 2025', 'Pierre Leroy', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours', 'valid', 'Hall A'),
('11111111-2222-4333-8444-555555555004', 'evt-websummit-2025', 'Web Summit 2025', 'Luc Moreau', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours', 'expired', 'Hall C'),

-- Le Roi Lion Scans
('febe8f71-3d2e-4b1a-9c8d-7e6f5a4b3c2d', 'evt-roilion-2025', 'Le Roi Lion', 'Anne Petit', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', 'valid', 'Entrée Théâtre'),
('febe8f71-3d2e-4b1a-9c8d-7e6f5a4b3c2d', 'evt-roilion-2025', 'Le Roi Lion', 'Anne Petit', NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '25 minutes', 'already_scanned', 'Entrée Théâtre'),
('11111111-2222-4333-8444-555555555005', 'evt-roilion-2025', 'Le Roi Lion', 'Anne Petit', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes', 'valid', 'Balcon'),
('11111111-2222-4333-8444-555555555006', 'evt-roilion-2025', 'Le Roi Lion', 'Thomas Roux', NOW() - INTERVAL '40 minutes', NOW() - INTERVAL '40 minutes', 'invalid', 'Orchestre');
