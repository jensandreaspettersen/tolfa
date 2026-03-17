USE tolfa_poc;

-- Areas
INSERT INTO hrbs_area (id, area_name) VALUES
  (1, 'Haus'),
  (2, 'Villa'),
  (3, 'Venteliste');

-- Slots: V1–V8 in Haus, T1/T2/T2.1/T3/T4 in Villa, X1–X5 waiting list
INSERT INTO hrbs_slot (id, area_id, slot_name, capacity) VALUES
  (1,  1, 'V1',   4),
  (2,  1, 'V2',   4),
  (3,  1, 'V3',   3),
  (4,  1, 'V4',   4),
  (5,  1, 'V5',   2),
  (6,  1, 'V6',   4),
  (7,  1, 'V7',   3),
  (8,  1, 'V8',   2),
  (9,  2, 'T1',   5),
  (10, 2, 'T2',   4),
  (11, 2, 'T2.1', 3),
  (12, 2, 'T3',   4),
  (13, 2, 'T4',   2),
  (14, 3, 'X1',   4),
  (15, 3, 'X2',   4),
  (16, 3, 'X3',   3),
  (17, 3, 'X4',   4),
  (18, 3, 'X5',   2);

-- Members
INSERT INTO hrbs_member (id, mid, username, family, email1, password, privmask) VALUES
  (42, 42, 'hansen', 'Hansen', 'anna@hansen.no',      'fe01ce2a7fbac8fafaed7c982a04e229', 0x83),
  (7,  7,  'olsen',  'Olsen',  'olsen@example.com',   'fe01ce2a7fbac8fafaed7c982a04e229', 0x03),
  (12, 12, 'berg',   'Berg',   'berg@example.com',    'fe01ce2a7fbac8fafaed7c982a04e229', 0x03),
  (19, 19, 'dahl',   'Dahl',   'dahl@example.com',    'fe01ce2a7fbac8fafaed7c982a04e229', 0x87);

-- Bookings (start_time/end_time stored as UTC midnight UNIX timestamps)
INSERT INTO hrbs_entry (id, slot_id, pid, family, initials, start_time, end_time, type, adult, child12, child00, amount_due, amount_res, comment) VALUES
  -- March 2026 Haus
  (1,  1,  7,  'Olsen',  'OO', 1772409600, 1772841600, 'M', 2, 0, 0, 2800, 2800, ''),
  (2,  2,  12, 'Berg',   'AB', 1772668800, 1773100800, 'B', 3, 1, 0, 4200, 2100, 'Familiebesøk'),
  (3,  4,  19, 'Dahl',   'KD', 1772928000, 1773532800, 'S', 8, 0, 0, 6000, 6000, 'Kurs'),
  (4,  3,  42, 'Hansen', 'AH', 1773446400, 1773878400, 'M', 2, 0, 0, 3200, 1600, ''),
  (5,  6,  7,  'Olsen',  'OO', 1773964800, 1774396800, 'X', 2, 2, 0, 4800, 4800, ''),
  (6,  5,  12, 'Berg',   'AB', 1774137600, 1774656000, 'W', 2, 0, 0, 2400, 0,    'Venteliste plass'),
  -- May 2026 Villa
  (7,  9,  42, 'Hansen', 'AH', 1778803200, 1779408000, 'B', 2, 2, 0, 5600, 2800, 'Tar med barna'),
  -- April 2026 Haus
  (8,  6,  7,  'Olsen',  'OO', 1776470400, 1776988800, 'M', 2, 0, 0, 3200, 3200, ''),
  -- Past (Feb 2026)
  (9,  3,  42, 'Hansen', 'AH', 1770681600, 1771113600, 'M', 2, 0, 0, 3200, 3200, ''),
  -- March 2026 more
  (10, 7,  19, 'Dahl',   'KD', 1773100800, 1773532800, 'Y', 4, 2, 0, 5600, 2800, 'Venner fra utlandet'),
  -- April 2026 Villa
  (11, 10, 12, 'Berg',   'AB', 1775347200, 1775952000, 'B', 3, 0, 0, 3600, 3600, ''),
  (12, 11, 19, 'Dahl',   'KD', 1776643200, 1777161600, 'M', 2, 1, 0, 4200, 2100, ''),
  -- Jan 2026
  (13, 1,  7,  'Olsen',  'OO', 1768003200, 1768608000, 'M', 2, 0, 0, 2800, 2800, ''),
  (14, 2,  12, 'Berg',   'AB', 1768867200, 1769472000, 'B', 4, 2, 0, 5600, 5600, 'Nyttårsferie'),
  -- Feb 2026
  (15, 8,  19, 'Dahl',   'KD', 1771545600, 1772236800, 'X', 3, 0, 0, 3600, 3600, ''),
  -- April 2026
  (16, 12, 7,  'Olsen',  'OO', 1775779200, 1776384000, 'M', 2, 0, 0, 2800, 1400, ''),
  -- May 2026
  (17, 13, 12, 'Berg',   'AB', 1777593600, 1778198400, 'S', 6, 0, 0, 7200, 7200, 'Kurs'),
  (18, 4,  42, 'Hansen', 'AH', 1779062400, 1779667200, 'B', 2, 2, 0, 4800, 0,    'Sommer'),
  (19, 5,  19, 'Dahl',   'KD', 1779235200, 1779840000, 'M', 1, 0, 0, 1600, 800,  '');

-- Cost rates
INSERT INTO hrbs_cost (type, label, adult_low, adult_high, child_low, child_high) VALUES
  ('M', 'Medlem',             320, 480, 160, 240),
  ('B', 'Familie',            360, 520, 180, 260),
  ('A', 'Familie (assosiert)',380, 540, 190, 270),
  ('X', 'Venner',             400, 560, 200, 280),
  ('Y', 'Venner (assosiert)', 420, 580, 210, 290),
  ('Z', 'Solo',               300, 440, 150, 220),
  ('S', 'Seminar',            280, 400, 140, 200),
  ('K', 'Spesiell',           0,   0,   0,   0  ),
  ('W', 'Venteliste',         320, 480, 160, 240);

-- Config
INSERT INTO hrbs_config (cfg_key, cfg_value) VALUES
  ('site_name', 'Tolfa Booking POC'),
  ('timezone',  'Europe/Oslo');
