import { Pool, type QueryResult, type QueryResultRow } from 'pg';

const globalForDb = globalThis as typeof globalThis & {
  orangeJellyDbPool?: Pool;
};

function getSslConfig(connectionString: string) {
  if (process.env.DATABASE_SSL === 'false') {
    return false;
  }

  if (process.env.DATABASE_SSL === 'true' || /sslmode=require|ssl=true/i.test(connectionString)) {
    return { rejectUnauthorized: false };
  }

  return undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDbPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  if (!globalForDb.orangeJellyDbPool) {
    globalForDb.orangeJellyDbPool = new Pool({
      connectionString,
      ssl: getSslConfig(connectionString),
      max: 5,
    });
  }

  return globalForDb.orangeJellyDbPool;
}

export async function dbQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = []
): Promise<QueryResult<T>> {
  return getDbPool().query<T>(text, values);
}
