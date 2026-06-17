--DROP TABLE IF EXISTS products;

--CREATE TABLE products (id SERIAL PRIMARY KEY,seller_id INTEGER NOT NULL,name VARCHAR(100) NOT NULL,description TEXT,price NUMERIC(10,2) NOT NULL,category VARCHAR(100),stock INTEGER DEFAULT 0,image_url TEXT,created_at TIMESTAMP DEFAULT NOW());

--ALTER TABLE products ADD COLUMN brand TEXT;
--ALTER TABLE products ADD COLUMN color TEXT;
--ALTER TABLE products ADD COLUMN rating NUMERIC DEFAULT 0;

--Select id,name ,description, price,category,stock,image_url from products order by id desc;
--Select id,name ,description, price,category,stock,image_url from products where seller_id=3;

--select id,image_url from products;

--SELECT * FROM products;

--ALTER TABLE products ADD COLUMN is_active_admin BOOLEAN DEFAULT true;

--ALTER TABLE products ADD COLUMN is_active_seller BOOLEAN DEFAULT true;

--UPDATE products SET is_active_admin = is_active,is_active_seller = is_active;

--select id,name,seller_id from products;

--select * from products;

--select id,seller_id from products;

--select p.name,u.first_name,u.last_name from products p join users u on p.seller_id=u.id;

select id,seller_id from products;