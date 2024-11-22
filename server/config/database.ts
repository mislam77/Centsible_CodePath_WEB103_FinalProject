import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const config = {
    user: process.env.PGUSER as string,
    password: process.env.PGPASSWORD as string,
    host: process.env.PGHOST as string,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : undefined,
    database: process.env.PGDATABASE as string,
    ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : false
};

export const pool = new pg.Pool(config);