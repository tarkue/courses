import * as dotenv from 'dotenv';
import { config } from 'dotenv-flow';
import * as dotenvExpand from 'dotenv-expand';

export function expandEnvVariables(): void {
  dotenv.config();
  const envConfig = config({ purge_dotenv: true });
  dotenvExpand.expand(envConfig);
}
