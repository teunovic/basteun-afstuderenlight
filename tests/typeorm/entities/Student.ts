import {BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {StudentClass} from "./StudentClass";

@Entity()
export class Student extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 64 })
    @Index({ unique: true })
    name: string;

    @ManyToOne(type => StudentClass, studentClass => studentClass.students, { onDelete: "CASCADE" })
    studentClass: StudentClass;



}