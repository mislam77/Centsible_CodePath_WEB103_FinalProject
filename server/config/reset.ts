import { pool } from './database';
import './dotenv';

const resetDatabase = async () => {
    try {
        // Drop existing tables in reverse order of dependency
        await pool.query(`
            DROP TABLE IF EXISTS Transaction, Category, Users
        `);

        // Create Users table
        await pool.query(`
            CREATE TABLE Users (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );
        `);

        // Create Category table
        await pool.query(`
            CREATE TABLE Category (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                createdAt TIMESTAMP DEFAULT NOW(),
                name TEXT NOT NULL,
                userId INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
                icon TEXT NOT NULL,
                type TEXT DEFAULT 'income',
                UNIQUE (name, userId, type) -- Ensures unique category names per user and type
            );
        `);

        // Create Transaction table
        await pool.query(`
            CREATE TABLE Transaction (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                createdAt TIMESTAMP DEFAULT NOW(),
                updateAt TIMESTAMP DEFAULT NOW(),
                amount FLOAT NOT NULL,
                description TEXT NOT NULL,
                date TIMESTAMP NOT NULL,
                userId INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
                categoryId UUID NOT NULL REFERENCES Category(id) ON DELETE CASCADE,
                categoryName TEXT NOT NULL,
                type TEXT DEFAULT 'income',
                FOREIGN KEY (categoryName, userId, type) REFERENCES Category(name, userId, type) ON DELETE CASCADE
            );
        `);

        console.log('Database reset successfully');
    } catch (error) {
        console.error('Error resetting database:', error);
    } finally {
        pool.end();
    }
};

resetDatabase();