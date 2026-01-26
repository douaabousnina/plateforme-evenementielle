INSERT INTO scan_logs ("ticketId", "eventId", "eventName", "scannedBy", "scannedAt", timestamp, status, location) VALUES
('d312c8bc-8c4e-4aae-bc55-5d5e3d4f8e2a', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', 'Jean Dupont', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', 'valid', 'Entrée Principale'),
('d312c8bc-8c4e-4aae-bc55-5d5e3d4f8e2a', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', 'Marie Martin', NOW() - INTERVAL '1 hour 50 minutes', NOW() - INTERVAL '1 hour 50 minutes', 'already_scanned', 'Entrée VIP'),
('d30503f6-5f0e-4c5d-8a9b-2e1f5a6d7c8b', 'evt-websummit-2025', 'Web Summit 2025', 'Pierre Leroy', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours', 'valid', 'Hall A'),
('d30503f6-5f0e-4c5d-8a9b-2e1f5a6d7c8b', 'evt-websummit-2025', 'Web Summit 2025', 'Sophie Bernard', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours', 'already_scanned', 'Hall B'),
('d30503f6-5f0e-4c5d-8a9b-2e1f5a6d7c8b', 'evt-websummit-2025', 'Web Summit 2025', 'Luc Moreau', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', 'already_scanned', 'Networking Zone'),
('febe8f71-3d2e-4b1a-9c8d-7e6f5a4b3c2d', 'evt-roilion-2025', 'Le Roi Lion', 'Anne Petit', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', 'valid', 'Entrée Théâtre'),
('febe8f71-3d2e-4b1a-9c8d-7e6f5a4b3c2d', 'evt-roilion-2025', 'Le Roi Lion', 'Anne Petit', NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '25 minutes', 'already_scanned', 'Entrée Théâtre'),
('fake-001', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', 'Jean Dupont', NOW() - INTERVAL '2 hours 30 minutes', NOW() - INTERVAL '2 hours 30 minutes', 'valid', 'Entrée Principale'),
('fake-002', 'evt-coldplay-2025', 'Coldplay - Music of the Spheres', 'Marie Martin', NOW() - INTERVAL '2 hours 15 minutes', NOW() - INTERVAL '2 hours 15 minutes', 'valid', 'Entrée VIP'),
('fake-003', 'evt-websummit-2025', 'Web Summit 2025', 'Pierre Leroy', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours', 'valid', 'Hall A'),
('fake-004', 'evt-websummit-2025', 'Web Summit 2025', 'Luc Moreau', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours', 'expired', 'Hall C'),
('fake-005', 'evt-roilion-2025', 'Le Roi Lion', 'Anne Petit', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes', 'valid', 'Balcon'),
('fake-006', 'evt-roilion-2025', 'Le Roi Lion', 'Thomas Roux', NOW() - INTERVAL '40 minutes', NOW() - INTERVAL '40 minutes', 'invalid', 'Orchestre');
