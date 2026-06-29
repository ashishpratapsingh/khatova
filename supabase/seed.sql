-- Seed Khatova with demo data + one login per role.
-- Default password for every seeded account: khatova123

-- Clients ------------------------------------------------------------------
insert into clients (id, company, contact, email, initials, threshold_paise, policy, balance_paise) values
  ('11111111-1111-1111-1111-111111111111','Acme Retail','Vikram Rao','billing@acmeretail.in','AR',5000000,'BLOCK',48250000),
  ('22222222-2222-2222-2222-222222222222','Bluewave Logistics','Sana Iqbal','accounts@bluewave.in','BL',2500000,'PAUSE',1230000),
  ('33333333-3333-3333-3333-333333333333','Cedar Health','Dr. Anil Menon','finance@cedarhealth.in','CH',3000000,'BLOCK',19500000),
  ('44444444-4444-4444-4444-444444444444','Delta Media','Farah Khan','ap@deltamedia.in','DM',1000000,'ALLOW',-840000),
  ('55555555-5555-5555-5555-555555555555','Evergreen EdTech','Karan Bose','billing@evergreen.edu','EE',4000000,'BLOCK',33000000);

-- Auth users + profiles ----------------------------------------------------
select create_auth_user('maya@khatova.app',  'khatova123', 'Maya Kapoor',  'admin');
select create_auth_user('priya@khatova.app', 'khatova123', 'Priya Sharma', 'staff');
select create_auth_user('rohan@khatova.app', 'khatova123', 'Rohan Mehta',  'staff');
select create_auth_user('vikram@khatova.app','khatova123', 'Vikram Rao',   'client',
                        '11111111-1111-1111-1111-111111111111');

-- Contracts ----------------------------------------------------------------
insert into contracts (id, name, client_id, client_company, type, status, approval, start_date, end_date, rate_summary, staff_count) values
  ('10000000-0000-0000-0000-000000000001','E-commerce Platform Build','11111111-1111-1111-1111-111111111111','Acme Retail','HOURLY','ACTIVE','MANUAL','2025-01-15',null,'₹1,000–₹2,500 / hr',3),
  ('10000000-0000-0000-0000-000000000002','Operations Retainer','22222222-2222-2222-2222-222222222222','Bluewave Logistics','SUBSCRIPTION','ACTIVE','AUTO','2025-03-01',null,'₹10,000 / month',1),
  ('10000000-0000-0000-0000-000000000003','Patient Portal App','33333333-3333-3333-3333-333333333333','Cedar Health','MILESTONE','ACTIVE','MANUAL','2025-02-01',null,'3 milestones · ₹2,30,000',2),
  ('10000000-0000-0000-0000-000000000004','API Usage Plan','44444444-4444-4444-4444-444444444444','Delta Media','METERED','ACTIVE','AUTO','2025-04-01',null,'Per-unit metered',1),
  ('10000000-0000-0000-0000-000000000005','Brand & Design Sprint','55555555-5555-5555-5555-555555555555','Evergreen EdTech','HOURLY','PAUSED','MANUAL','2025-05-05','2025-08-05','₹1,500 / hr',1);

-- Contract rate cards ------------------------------------------------------
insert into contract_rates (contract_id, kind, label, rate_key, sub, amount_paise, done, interval, day, sort) values
  ('10000000-0000-0000-0000-000000000001','roles','Senior Developer','senior_dev','per hour',250000,false,null,null,0),
  ('10000000-0000-0000-0000-000000000001','roles','Junior Developer','junior_dev','per hour',100000,false,null,null,1),
  ('10000000-0000-0000-0000-000000000001','roles','Designer','designer','per hour',150000,false,null,null,2),
  ('10000000-0000-0000-0000-000000000002','sub','Monthly retainer','retainer',null,1000000,false,'monthly',1,0),
  ('10000000-0000-0000-0000-000000000003','milestones','UI/UX Design','m_design',null,5000000,true,null,null,0),
  ('10000000-0000-0000-0000-000000000003','milestones','Backend Development','m_backend',null,12000000,false,null,null,1),
  ('10000000-0000-0000-0000-000000000003','milestones','Launch & QA','m_launch',null,6000000,false,null,null,2),
  ('10000000-0000-0000-0000-000000000004','units','API Calls','api_call','per 1,000 calls',10000,false,null,null,0),
  ('10000000-0000-0000-0000-000000000004','units','Storage','gb_storage','per GB / month',5000,false,null,null,1),
  ('10000000-0000-0000-0000-000000000004','units','Deployment','deploy','per deploy',50000,false,null,null,2),
  ('10000000-0000-0000-0000-000000000005','roles','Designer','designer','per hour',150000,false,null,null,0);

-- Staff assignments --------------------------------------------------------
insert into contract_staff (contract_id, staff_id)
select '10000000-0000-0000-0000-000000000001', id from profiles where full_name in ('Priya Sharma','Rohan Mehta');
insert into contract_staff (contract_id, staff_id)
select '10000000-0000-0000-0000-000000000003', id from profiles where full_name = 'Priya Sharma';
insert into contract_staff (contract_id, staff_id)
select '10000000-0000-0000-0000-000000000005', id from profiles where full_name = 'Rohan Mehta';

-- Usage events -------------------------------------------------------------
insert into usage_events (contract_id, client_id, staff_id, staff_name, client_company, type, unit, qty, amount_paise, status, event_date, description, reason) values
  ('10000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',(select id from profiles where full_name='Priya Sharma'),'Priya Sharma','Acme Retail','HOURLY','Senior Developer',6.5,1625000,'PENDING','2025-06-23','Checkout flow + payment gateway integration',null),
  ('10000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',(select id from profiles where full_name='Rohan Mehta'),'Rohan Mehta','Acme Retail','HOURLY','Designer',4,600000,'PENDING','2025-06-23','Product detail page redesign',null),
  ('10000000-0000-0000-0000-000000000003','33333333-3333-3333-3333-333333333333',(select id from profiles where full_name='Priya Sharma'),'Priya Sharma','Cedar Health','MILESTONE','UI/UX Design',1,5000000,'PENDING','2025-06-22','UI/UX design milestone — delivered & signed off',null),
  ('10000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',(select id from profiles where full_name='Priya Sharma'),'Priya Sharma','Acme Retail','HOURLY','Senior Developer',10,2500000,'BILLED','2025-06-10','Payment reconciliation service',null),
  ('10000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',null,'Anjali Nair','Acme Retail','HOURLY','Junior Developer',20,2000000,'BILLED','2025-06-18','Admin dashboard CRUD screens',null),
  ('10000000-0000-0000-0000-000000000004','44444444-4444-4444-4444-444444444444',null,'System','Delta Media','METERED','API Calls',128,1280000,'BILLED','2025-06-20','Month-end metered API usage',null),
  ('10000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',(select id from profiles where full_name='Rohan Mehta'),'Rohan Mehta','Acme Retail','HOURLY','Designer',8,1200000,'REJECTED','2025-06-15','Marketing microsite design','Out of contract scope — bill on a separate engagement');

-- Acme ledger (snapshot; balances are pre-computed running balances) --------
insert into ledger_entries (client_id, entry_type, description, amount_paise, balance_paise, neg, created_at) values
  ('11111111-1111-1111-1111-111111111111','DEBIT','Metered usage — month-end adjustment',675000,48250000,false,'2025-06-22 18:00'),
  ('11111111-1111-1111-1111-111111111111','DEBIT','Senior Developer · 6.5h — Priya Sharma',1625000,48925000,false,'2025-06-21 18:00'),
  ('11111111-1111-1111-1111-111111111111','DEBIT','Designer · 8h — Rohan Mehta',1200000,50550000,false,'2025-06-20 18:00'),
  ('11111111-1111-1111-1111-111111111111','DEBIT','Junior Developer · 20h — Anjali Nair',2000000,51750000,false,'2025-06-18 18:00'),
  ('11111111-1111-1111-1111-111111111111','ADJUSTMENT','Goodwill credit — service delay',350000,53750000,false,'2025-06-14 18:00'),
  ('11111111-1111-1111-1111-111111111111','DEBIT','Senior Developer · 10h — Priya Sharma',2500000,53400000,false,'2025-06-10 18:00'),
  ('11111111-1111-1111-1111-111111111111','CREDIT','Top-up via Bank Transfer',30000000,55900000,false,'2025-06-01 18:00'),
  ('11111111-1111-1111-1111-111111111111','DEBIT','Junior Developer · 12h — Anjali Nair',1200000,25900000,false,'2025-05-24 18:00'),
  ('11111111-1111-1111-1111-111111111111','DEBIT','Designer · 6h — Rohan Mehta',900000,27100000,false,'2025-05-16 18:00'),
  ('11111111-1111-1111-1111-111111111111','DEBIT','Senior Developer · 8h — Priya Sharma',2000000,28000000,false,'2025-05-09 18:00'),
  ('11111111-1111-1111-1111-111111111111','CREDIT','Top-up via UPI',30000000,30000000,false,'2025-05-02 18:00');
