import { pool } from './database';
import './dotenv';

const resetDatabase = async () => {
    try {
        // Drop existing tables in reverse order of dependency
        await pool.query(`
            DROP TABLE IF EXISTS UserCategory, Transaction, Category, MonthHistory, YearHistory, UserSettings, Users
        `);

        // Create Users table
        await pool.query(`
            CREATE TABLE Users (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );
        `);

        // Create UserSettings table
        await pool.query(`
            CREATE TABLE UserSettings (
                userId INT PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
                currency TEXT NOT NULL
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
                UNIQUE (name, userId, type)
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
                type TEXT DEFAULT 'income'
            );
        `);

        // Create UserCategory table for many-to-many relationship
        await pool.query(`
            CREATE TABLE UserCategory (
                userId INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
                categoryId UUID NOT NULL REFERENCES Category(id) ON DELETE CASCADE,
                PRIMARY KEY (userId, categoryId)
            );
        `);

        // Create MonthHistory table
        await pool.query(`
            CREATE TABLE MonthHistory (
                userId INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
                day INT NOT NULL,
                month INT NOT NULL,
                year INT NOT NULL,
                income FLOAT NOT NULL,
                expense FLOAT NOT NULL,
                PRIMARY KEY (day, month, year, userId)
            );
        `);

        // Create YearHistory table
        await pool.query(`
            CREATE TABLE YearHistory (
                userId INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
                month INT NOT NULL,
                year INT NOT NULL,
                income FLOAT NOT NULL,
                expense FLOAT NOT NULL,
                PRIMARY KEY (month, year, userId)
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