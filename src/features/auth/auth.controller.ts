import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Version,
} from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '@/constants';
import { CurrentUser, Auth } from '@/decorators';

import {
  RegisterDto,
  UserLoginDto,
  LoginPayloadDto,
} from '@/features/auth/dto';
import { AuthService } from '@features/auth/auth.service';

import { UserDto } from '@features/user/dto';
import { UserService } from '@features/user/user.service';
import { UserEntity } from '@features/user/entities';

@ApiTags('[後台] auth')
@Controller('auth')
export class AuthController {
  constructor(
    private userServer: UserService,
    private authService: AuthService,
  ) {}

  @Version('1')
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'api-key',
    description: 'g5?v?-=UAe@8qHXhKa@7hPe$udHv8unV',
  })
  @ApiOkResponse({
    type: UserDto,
    description: '後台註冊, 只能在內網call, header 需要 api key',
  })
  @Auth('admin', [], { internal: true, public: true, isAPiKey: true })
  async register(@Body() registerDto: RegisterDto): Promise<UserDto> {
    const createUser = await this.userServer.create(registerDto);
    return createUser.toDto();
  }

  @Version('1')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'api-key',
    description: 'g5?v?-=UAe@8qHXhKa@7hPe$udHv8unV',
  })
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: '後台使用者登入, 只能在內網call, header 需要 api key',
  })
  @Auth('admin', [], { internal: true, public: true, isAPiKey: true })
  async login(@Body() loginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(loginDto);
    const token = await this.authService.createBackstageToken({
      userId: userEntity.id,
      role: userEntity.role,
    });

    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginPayloadDto, description: '後台當前使用者資訊' })
  @Auth('admin', [RoleType.USER, RoleType.ADMIN])
  getCurrentUser(
    @CurrentUser()
    { user, token }: { user: UserEntity; token: string },
  ): LoginPayloadDto {
    const tokenPayload = this.authService.decodeToken(token);
    return new LoginPayloadDto(user.toDto(), tokenPayload);
  }
}
