

--CREATE TABLE cart (cart_id SERIAL PRIMARY KEY,buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,quantity INTEGER DEFAULT 1,created_at TIMESTAMP DEFAULT NOW());


--select column_name from information_schema.columns where table_name='cart';

--alter table cart add column is_saved_for_later Boolean default false;

select * from cart;