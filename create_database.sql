-- Create the database if it does not exist (must be run as a superuser or with appropriate permissions)
CREATE DATABASE collectmycats;
-- Connect to the CATS database (this command is run from your SQL client or application, not in the SQL script)
\connect collectmycats
-- Create the table within the CATS database
CREATE TABLE IF NOT EXISTS cats (
    id VARCHAR(255),
    width INTEGER,
    height INTEGER,
    url VARCHAR(255),
    favourite BOOLEAN,
    name VARCHAR(255),
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS favouritecats (
    id VARCHAR(255),
    width INTEGER,
    height INTEGER,
    url VARCHAR(255),
    favourite BOOLEAN,
    name VARCHAR(255),
    description VARCHAR(255)
);