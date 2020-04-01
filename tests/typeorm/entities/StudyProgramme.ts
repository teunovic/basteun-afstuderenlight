import {BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {StudentClass} from "./StudentClass";
import {Academy} from "./Academy";

@Entity()
export class StudyProgramme extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 64 })
    @Index({ unique: true })
    name: string;

    @ManyToOne(type => Academy, academy => academy.studyProgrammes, { onDelete: "CASCADE" })
    academy: Academy;

    @OneToMany(type => StudentClass, studentClass => studentClass.studyProgramme, {eager: true, cascade: ["insert", "update"]})
    studentClasses: StudentClass[];

}