UPDATE users 
SET password = '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.' 
WHERE email = 'admin@kadesh.local';

SELECT id, email, password FROM users WHERE email = 'admin@kadesh.local';
