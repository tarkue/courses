import { Module } from '@nestjs/common';
import { AuthService, MailService } from '../services';
import { AuthController } from '../../application/controllers';
import { OrmModule } from '../../infrastructure/database/orm';
import { UserSchema } from '../entities';
import { AuthRepository } from '../../infrastructure/repositories';
import { Entities } from '../enums/entitites.enum';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvObjects, JWTConfig } from 'src/infrastructure/config';

@Module({
  imports: [
    OrmModule.forFeature([{ name: Entities.User, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<JWTConfig>(EnvObjects.JWT_OPTIONS).secret,
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, MailService],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
