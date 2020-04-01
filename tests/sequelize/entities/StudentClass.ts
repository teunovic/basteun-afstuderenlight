import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import StudyProgramme from "./StudyProgramme";
import Student from "./Student";


@Table
export default class StudentClass extends Model<StudentClass> {

    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @Column({type: DataType.TEXT, unique: true})
    name: string;

    @ForeignKey(() => StudyProgramme)
    @Column
    studyProgrammeId: number;

    @BelongsTo(() => StudyProgramme)
    studyProgrammes: StudyProgramme;

    @HasMany(() => Student, { onDelete: "CASCADE", onUpdate: "CASCADE", hooks: true })
    students: Student[];

}