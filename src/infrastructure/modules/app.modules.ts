import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  configuration,
  EnvObjects,
  MongoOptions,
  SMTPConfig,
} from '../config/env.objects';
import { OrmModule } from '../database/orm';
import { validate } from '../config/env.validation';
import { AuthModule, CourseModule, UserModule } from 'src/domain/modules';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate,
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    OrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const data = configService.get<MongoOptions>(EnvObjects.MONGO_OPTIONS);
        return { uri: data?.host, ...data?.options };
      },
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => {
        const data = config.get<SMTPConfig>(EnvObjects.SMTP_OPTIONS);

        return {
          transport: {
            host: data.host,
            port: data.port,
            secure: false,
            auth: {
              user: data.options.auth.user,
              pass: data.options.auth.pass,
            },
          },
          defaults: {
            from: data.options.from,
          },
          template: {
            dir: 'src/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),

    AuthModule,
    UserModule,
    CourseModule,
  ],
  controllers: [],
})
export class AppModule {}
