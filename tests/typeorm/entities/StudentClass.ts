import {StudyProgramme} from "./StudyProgramme";
import {BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "./Student";

@Entity()
export class StudentClass extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 64 })
    @Index({ unique: true })
    name: string;

    @ManyToOne(type => StudyProgramme, studyProgramme => studyProgramme.studentClasses, { onDelete: "CASCADE" })
    studyProgramme: StudyProgramme;

    @OneToMany(type => Student, student => student.studentClass, { eager: true, cascade: ["insert", "update"] })
    students: Student[];

}