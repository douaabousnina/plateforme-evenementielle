import { IsEmail,MinLength,IsEnum,IsOptional,IsArray } from "class-validator";
import { Preference } from "../../common/enums/preference.enum";
import { Role } from "../../common/enums/role.enum";

export class CreateUserDto {
    @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
  @IsOptional()

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsArray()
  @IsEnum(Preference, { each: true })
  preferences?: Preference[];

}
