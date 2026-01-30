import { forwardRef, Inject, Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
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
      throw new UnauthorizedException('Email ou mot de passe incorrect');
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
    role: role || Role.CLIENT,
  };
   const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Cette adresse email est déjà utilisée');

    }
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%+*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new BadRequestException('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
  }

    const user = await this.usersService.create(dto);
    return this.generateTokens(user.id, user.email, user.role);
  }
    }
