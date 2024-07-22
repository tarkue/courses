import { expandEnvVariables } from '../../domain/helpers/';

expandEnvVariables();

export enum EnvObjects {
  MONGO_OPTIONS = 'MongoOptions',
  SMTP_OPTIONS = 'SMTPOptions',
  JWT_OPTIONS = 'JWTOptions',
  APP_CONFIG = 'AppConfig',
}

export interface MongoOptions {
  host: string;
  options: {
    dbName: string;
    auth: {
      user: string;
      password: string;
    };
  };
}

export interface SMTPConfig {
  host: string;
  port: number;
  data: {
    registrationEndpoint: string;
    passwordResetEndpoint;
  };
  options: {
    from: string;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export interface JWTConfig {
  secret: string;
}

export interface AppConfig {
  admin_key: string;
}

export const configuration = (): any => ({
  MongoOptions: {
    host: process.env.MONGO_CLIENT_URL,
    options: {
      dbName: process.env.MONGO_DB_NAME,
      auth: {
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASS,
      },
    },
  },
  SMTPOptions: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    data: {
      registrationEndpoint: process.env.REGISTRATION_ENDPOINT,
      passwordResetEndpoint: process.env.PASSWORD_RESET_ENDPOINT,
    },
    options: {
      from: process.env.SMTP_FROM,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  },
  JWTOptions: {
    secret: process.env.JWT_SECRET,
  },
  AppConfig: {
    admin_key: process.env.ADMIN_KEY,
  },
});
