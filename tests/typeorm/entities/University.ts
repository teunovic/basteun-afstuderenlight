import {BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Academy} from "./Academy";


@Entity()
export class University extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 64 })
    @Index({ unique: true })
    name: string;

    @OneToMany(type => Academy, academy => academy.university, { eager: true, cascade: ["insert", "update"] })
    academies: Academy[];

}