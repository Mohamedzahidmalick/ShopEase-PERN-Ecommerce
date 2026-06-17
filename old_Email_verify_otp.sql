DROP table if exists email_otps;

CREATE TABLE email_otps (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  otp VARCHAR(10) NOT NULL,
  type VARCHAR(20) NOT NULL, -- buyer or seller
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);