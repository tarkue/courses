import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/domain/services';
import {
  ResetPasswordDTO,
  RestorePasswordDTO,
  UpdatePasswordDTO,
  UpgradeDTO,
} from '../dto';
import { AdminGuard, AuthGuard } from 'src/domain/guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Post('updatePassword')
  async updatePassword(
    @Req() req: Request,
    @Body() updatePasswordDTO: UpdatePasswordDTO,
  ): Promise<void> {
    const dto = new UpdatePasswordDTO(updatePasswordDTO);
    await this.userService.updatePassword(req['user'].email, dto);
  }

  @UseGuards(AdminGuard)
  @Post('upgrade')
  async upgrade(@Body() upgradeDTO: UpgradeDTO): Promise<void> {
    const dto = new UpgradeDTO(upgradeDTO);
    await this.userService.upgrade(dto);
  }

  @Post('restorePassword')
  async restorePassword(
    @Body() restorePasswordDTO: RestorePasswordDTO,
  ): Promise<void> {
    const dto = new RestorePasswordDTO(restorePasswordDTO);
    await this.userService.sendPasswordRestoreLink(dto);
  }

  @Post('resetPassword')
  async resetPassword(
    @Body() resetPasswordDTO: ResetPasswordDTO,
  ): Promise<void> {
    const dto = new ResetPasswordDTO(resetPasswordDTO);
    await this.userService.resetPassword(dto);
  }
}
