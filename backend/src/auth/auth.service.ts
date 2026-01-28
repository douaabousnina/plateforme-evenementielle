import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service'; 
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enums/role.enum';
import  {CreateUserDto } from '../users/dto/create-user.dto';
import { Preference } from '../common/enums/preference.enum';

@Injectable()
export class AuthService {
  constructor(
    
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  private generateTokens(userId: number, email: string, role: Role) {
    const payload = { sub: userId, email, role };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload),
    };
  }
  async register(email: string, password: string, preferences ?: Preference [],role?: Role) {
    let dto: CreateUserDto;

     dto = {
    email,
    password,
    preferences,
    role: role ? Role.CLIENT:Role.ORGANIZER,
  };
   const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');

    }
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%+*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new UnauthorizedException('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character');
  }

    try{
   
    const user = await this.usersService.create(dto);
    return this.generateTokens(user.id, user.email, user.role);
  } catch (error) {
    throw new UnauthorizedException('Registration failed');
  }
  }
    }
