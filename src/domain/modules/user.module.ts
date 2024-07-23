import { Module } from '@nestjs/common';
import { MailService, UserService } from '../services';
import { UserController } from '../../application/controllers';
import { OrmModule } from '../../infrastructure/database/orm';
import { UserSchema } from '../entities';
import { UserRepository } from '../../infrastructure/repositories';
import { Entities } from '../enums/entitites.enum';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    OrmModule.forFeature([{ name: Entities.User, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, MailService, JwtService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
