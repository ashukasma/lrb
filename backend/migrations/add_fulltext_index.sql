-- Add fulltext index to users table
ALTER TABLE users ADD FULLTEXT INDEX idx_users_search (name, email, phone_number, employeeId); 