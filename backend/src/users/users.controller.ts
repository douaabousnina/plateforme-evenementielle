import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '..//auth/jwt-auth.guard';
import { RolesGuard } from '..//auth/roles.guard';
import { Roles } from '..//auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ForbiddenException } from '@nestjs/common';
import { AuthService } from '..//auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}
  @Get('me')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.CLIENT,Role.ORGANIZER)
  getMyProfile(@Req() req) {
    return this.usersService.findById(req.user.sub);
  }

  @Patch('me')
   @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.CLIENT,Role.ORGANIZER)
  updateMyProfile(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.sub, dto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.CLIENT, Role.ORGANIZER)
  async remove(@Req() req) {

    const currentUserId = +(req.user.sub);

 
    await this.usersService.remove(currentUserId);
    return { message: 'You deleted your account successfully!' };
  }
  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto.email, createUserDto.password, createUserDto.preferences);
  }

  
  @Get()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }


  @Get(':id')
    @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }
  

  @Get('by-email/:email')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
 
  @Patch(':id')
   @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  async removeById(@Param('id') id: string, @Req() req) {
    const userId = +id;
 
  
    const user= await this.usersService.findById(userId);
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    await this.usersService.remove(userId);
    return { message: `User ${user.email} deleted` };

  }
 
}