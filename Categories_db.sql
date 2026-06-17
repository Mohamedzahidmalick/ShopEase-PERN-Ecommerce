CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO categories (name) VALUES
('Mobile'),
('Electronics'),
('Food'),
('Game');

select * from categories;