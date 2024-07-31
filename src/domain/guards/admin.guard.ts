import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, EnvObjects } from 'src/infrastructure/config/env.objects';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly config: AppConfig;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<AppConfig>(EnvObjects.APP_CONFIG);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const admin_key: string = request.body['admin_key'];

    if (this.config.admin_key != admin_key) throw new UnauthorizedException();

    return true;
  }
}
