import { Role } from "../../common/enums/role.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Preference } from "../../common/enums/preference.enum";
//import { Reservation } from "../../reservations/entities/reservation.entity";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string
    @Column({
        type:'enum',
        enum:Role,default:Role.CLIENT

    })role:Role;
    @Column({default:0})
    loyaltyPoints:number;
      @Column({
    type: 'enum',
    enum: Preference,
    array: true,
    default: [],
  })
  preferences: Preference[];
    @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;
  /*@OneToMany(() => Reservation, (r) => r.user)
  reservations: Reservation[];*/
    @CreateDateColumn({update:false})
    createdAt: Date;
}
