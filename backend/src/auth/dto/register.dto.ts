import { IsArray,  IsEmail, IsOptional, MinLength,IsEnum } from 'class-validator';
import { Preference } from '../../common/enums/preference.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Preference, { each: true })
  preferences?: Preference[];
}
