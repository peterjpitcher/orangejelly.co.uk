import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

function getSslConfig(connectionString: string) {
  if (process.env.DATABASE_SSL === 'false') {
    return false;
  }

  if (process.env.DATABASE_SSL === 'true' || /sslmode=require|ssl=true/i.test(connectionString)) {
    return { rejectUnauthorized: false };
  }

  return undefined;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required to run migrations.');
  }

  const pool = new Pool({
    connectionString,
    ssl: getSslConfig(connectionString),
    max: 1,
  });

  const migrationsDir = path.join(process.cwd(), 'db', 'migrations');
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    for (const filename of migrationFiles) {
      const applied = await client.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [
        filename,
      ]);

      if (applied.rowCount) {
        console.log(`Skipping ${filename}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, filename), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename]);
        await client.query('COMMIT');
        console.log(`Applied ${filename}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
