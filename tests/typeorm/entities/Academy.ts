import {BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {University} from "./University";
import {StudyProgramme} from "./StudyProgramme";


@Entity()
export class Academy extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 64 })
    @Index({ unique: true })
    name: string;

    @ManyToOne(type => University, school => school.academies, { onDelete: "CASCADE" })
    university: University;

    @OneToMany(type => StudyProgramme, studyProgramme => studyProgramme.academy, { eager: true, cascade: ["insert", "update"] })
    studyProgrammes: StudyProgramme[];

}