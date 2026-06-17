CREATE TABLE if NOT EXISTS wishlist (
    wishlist_id SERIAL PRIMARY KEY,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(buyer_id, product_id)
);

select * from wishlist;

select image_url from products;