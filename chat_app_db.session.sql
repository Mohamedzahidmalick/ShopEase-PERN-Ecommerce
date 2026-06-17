

-- View all users


--select table_name from information_schema.tables where table_schema='public';

--ALTER TABLE users ADD profile_image TEXT;

--select id, first_name, last_name, email, phone_no, role from users where email='zahid6374837062@gmail.com';

--select id, first_name, last_name, email, phone_no, role from users where email='aarifaziauddin@gmail.com';

--update users set first_name='Mohamed' ,last_name='Zahid Malick Z',phone_no='9876543210' where email='zahid6374837062@gmail.com';

--select * from users where email='zahid6374837062@gmail.com';

--update users set first_name='Aarifa' ,last_name='Ziauddin Z',phone_no='8765432123' where email='aarifaziauddin@gmail.com';

--select * from users where email='aarifaziauddin@gmail.com';

--alter TABLE users ADD COLUMN image TEXT;

--alter TABLE users drop COLUMN profile_image;

--SELECT * FROM users;

--SELECT email, role FROM users WHERE email='aarifaziauddin@gmail.com';

--delete from users where email='admin@grr.la';

--select email, image from users;

--select * from users limit 1;

--ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT false;

--select id,first_name, last_name, email from users where role='seller' and is_approved=false;

--alter table users add COLUMN status VARCHAR(255) NOT NULL DEFAULT 'pending';

--alter table users add constraint check_status CHECK (status IN ('pending', 'approved', 'rejected'));

--update users set status='approved' where id=1;

--SELECT id, first_name, last_name,email, status FROM users WHERE role = 'seller' ;

--update users set status='pending' where id=13;

--update users set is_verified=true where email='Seller@grr.la';

--select id,email,status,is_verified from users;

--alter table users ADD COLUMN is_blocked Boolean DEFAULT false;

--alter table users rename column status to seller_status;

--update users set is_seller_approved=true where seller_status='approved';

--update users set is_seller_approved=true where email='aarifaziauddin@gmail.com';

--select * from users;

--alter table users add column token_version INT default 0;

--select email from users where email='tester_1@grr.la';

select id,first_name,last_name from users 
where role='seller';