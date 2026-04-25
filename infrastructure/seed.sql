-- Insert owners first (password: Admin@123)
INSERT INTO owner (name, email, password, phone_number) VALUES
('Rahul Sharma', 'rahul@staynest.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lkii', '9876543210'),
('Priya Patel', 'priya@staynest.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lkii', '9876543211'),
('Amit Singh', 'amit@staynest.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lkii', '9876543212')
ON CONFLICT DO NOTHING;

-- Insert listings into pg_listings
INSERT INTO pg_listings (id, title, address, gender, is_wifi_avilable, is_ac_avilable, is_meals_avilable, is_laudry_avilable, is_cctv_avilable, is_parking_avilable, is_common_areas_avilable, is_study_desk_avilable, rent, deposite, discount, description, urls_string, start_date, owner_id) VALUES
(1, 'Cozy PG in Koramangala', '123 5th Block, Koramangala, Bangalore', 'Any', true, true, true, true, true, false, true, true, 4500, 9000, 0, 'Well furnished PG with all amenities near metro station', '[]', NOW(), 1),
(2, 'Affordable Hostel Andheri', '45 Andheri West, Mumbai', 'Any', true, false, true, true, false, false, true, false, 8500, 17000, 5, 'Budget friendly stay near metro', '[]', NOW(), 2),
(3, 'Student PG Powai', '78 Hiranandani, Powai, Mumbai', 'Male', true, true, false, true, true, true, true, true, 6500, 13000, 0, 'Near IIT Bombay, peaceful locality', '[]', NOW(), 2),
(4, 'Premium PG Banjara Hills', '12 Road No 10, Banjara Hills, Hyderabad', 'Any', true, true, true, true, true, true, true, true, 15000, 30000, 10, 'Luxury PG with all facilities', '[]', NOW(), 3),
(5, 'Budget Stay Madhapur', '56 Cyber City, Madhapur, Hyderabad', 'Any', true, false, true, false, false, false, true, false, 11000, 22000, 0, 'Affordable and clean accommodation', '[]', NOW(), 3),
(6, 'PG in HSR Layout', '34 Sector 2, HSR Layout, Bangalore', 'Female', true, true, false, true, true, false, true, true, 7000, 14000, 0, 'Spacious rooms with good ventilation', '[]', NOW(), 1),
(7, 'Hostel near Connaught Place', '89 CP Inner Circle, New Delhi', 'Male', true, false, true, false, true, false, true, false, 9000, 18000, 5, 'Central Delhi location', '[]', NOW(), 1),
(8, 'PG in Salt Lake', '23 Sector V, Salt Lake, Kolkata', 'Any', true, true, true, true, false, false, true, true, 6000, 12000, 0, 'IT hub accommodation', '[]', NOW(), 2),
(9, 'Student Hostel Anna Nagar', '67 2nd Avenue, Anna Nagar, Chennai', 'Any', true, false, true, true, false, false, true, true, 8500, 17000, 0, 'Near colleges and metro', '[]', NOW(), 3),
(10, 'PG in Viman Nagar', '45 Viman Nagar, Pune', 'Any', true, true, false, true, true, true, true, true, 8000, 16000, 0, 'Near airport and IT parks', '[]', NOW(), 1),
(11, 'Hostel in Indiranagar', '12 100ft Road, Indiranagar, Bangalore', 'Any', true, true, true, true, true, false, true, false, 7000, 14000, 5, 'Vibrant locality with good connectivity', '[]', NOW(), 2),
(12, 'PG near Hinjewadi', '78 Phase 1, Hinjewadi, Pune', 'Male', true, true, false, false, true, true, true, true, 9000, 18000, 0, 'IT park accommodation', '[]', NOW(), 3),
(13, 'Luxury PG Jubilee Hills', '34 Road No 36, Jubilee Hills, Hyderabad', 'Any', true, true, true, true, true, true, true, true, 16000, 32000, 10, 'Premium accommodation in posh area', '[]', NOW(), 1),
(14, 'Budget Hostel Lajpat Nagar', '56 Central Market, Lajpat Nagar, Delhi', 'Any', true, false, true, true, false, false, true, false, 7000, 14000, 0, 'Affordable stay in South Delhi', '[]', NOW(), 2),
(15, 'PG in Whitefield', '89 EPIP Zone, Whitefield, Bangalore', 'Any', true, true, false, true, true, true, true, true, 8500, 17000, 5, 'Near ITPL and tech parks', '[]', NOW(), 3)
ON CONFLICT DO NOTHING;

-- Insert room type details
INSERT INTO room_type_details (avilable_beds_per_room, beds_per_room, price, room_count, room_type, listing_id) VALUES
(2, 3, 4500, 5, 'Shared', 1),(1, 1, 7000, 3, 'Private', 1),
(3, 4, 8500, 6, 'Shared', 2),(1, 1, 12000, 2, 'Private', 2),
(2, 3, 4000, 4, 'Shared', 3),(1, 1, 6500, 2, 'Private', 3),
(3, 4, 11000, 5, 'Shared', 4),(1, 1, 15000, 2, 'Private', 4),
(2, 3, 8000, 4, 'Shared', 5),(1, 1, 11000, 2, 'Private', 5),
(2, 2, 7000, 3, 'Shared', 6),(1, 1, 10000, 2, 'Private', 6),
(3, 4, 9000, 6, 'Shared', 7),(1, 1, 13000, 2, 'Private', 7),
(2, 3, 6000, 4, 'Shared', 8),(1, 1, 9000, 2, 'Private', 8),
(2, 2, 8500, 3, 'Shared', 9),(1, 1, 12000, 2, 'Private', 9),
(2, 3, 5500, 4, 'Shared', 10),(1, 1, 8000, 2, 'Private', 10),
(3, 4, 10000, 5, 'Shared', 11),(1, 1, 14000, 2, 'Private', 11),
(2, 3, 9000, 4, 'Shared', 12),(1, 1, 13000, 2, 'Private', 12),
(3, 4, 12000, 5, 'Shared', 13),(1, 1, 16000, 2, 'Private', 13),
(2, 3, 7000, 4, 'Shared', 14),(1, 1, 9500, 2, 'Private', 14),
(2, 2, 8500, 3, 'Shared', 15),(1, 1, 12500, 2, 'Private', 15)
ON CONFLICT DO NOTHING;

-- Insert test user (password: Admin@123)
INSERT INTO users (name, email, password, role, phone_number, gender) VALUES
('Test User', 'user@staynest.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lkii', 'USER', '9999999999', 'Male')
ON CONFLICT DO NOTHING;
