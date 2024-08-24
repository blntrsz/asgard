-- Up Migration
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Down Migration
DROP TABLE tasks;
DROP EXTENSION "uuid-ossp";
