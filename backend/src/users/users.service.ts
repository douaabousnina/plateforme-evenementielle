import { Injectable, NotFoundException, ConflictException, UnauthorizedException, forwardRef, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Preference } from '../common/enums/preference.enum';
import { Role } from '../common/enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>) {}

    async create(dto:CreateUserDto):Promise<User>{
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create(
    {email: dto.email,
      password: hash,
      role: dto.role,
      preferences: dto.preferences ?? [],}
    );

    return this.userRepository.save(user);
    }
    async findByEmail(email:string):Promise<User | null>{
    return this.userRepository.findOne({where:{email}});
    }
    async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      //relations: ['reservations'], // utile pour historique billets
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
    async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'role', 'preferences', 'loyaltyPoints', 'name', 'lastName', 'phoneNumber', 'createdAt'],
    });
  }

    async update(id: number, dto: UpdateUserDto): Promise<User> {
     const user = await this.userRepository.update(id, dto);
     return this.findById(id);}
    async remove(id: number){
        
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.userRepository.update(id, { password: hashedPassword });
  }
  } 
