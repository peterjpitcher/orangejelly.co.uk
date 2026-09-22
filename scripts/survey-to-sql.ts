/**
 * Checks a survey definition and prints the SQL that puts it in the database.
 *
 *   npx tsx scripts/survey-to-sql.ts content/surveys/pub-apps.json > /tmp/pub-apps.sql
 *
 * Writes nothing and connects to nothing. Applying the SQL to production is a
 * separate step that needs Peter's go-ahead, like any other live database write.
 *
 * @see src/lib/surveys/definition.ts for what is checked
 */
import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { relative } from 'path';
import { checkDefinition, surveyDefinitionSchema } from '../src/lib/surveys/definition';
import { definitionToSql } from '../src/lib/surveys/sql';

const file = process.argv[2];
if (!file) {
  console.error('Usage: npx tsx scripts/survey-to-sql.ts content/surveys/<slug>.json');
  process.exit(1);
}

const raw: unknown = JSON.parse(readFileSync(file, 'utf8'));
const problems = checkDefinition(raw);
if (problems.length > 0) {
  console.error(`${file} has ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

// 18 bytes is 144 bits, which base64url-encodes to 24 characters, over the
// 22-character floor the surveys table enforces.
const previewToken = randomBytes(18).toString('base64url');
process.stdout.write(
  definitionToSql(surveyDefinitionSchema.parse(raw), previewToken, relative(process.cwd(), file))
);
