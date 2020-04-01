import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import Academy from "./Academy";
import StudentClass from "./StudentClass";


@Table
export default class StudyProgramme extends Model<StudyProgramme> {

    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @Column({type: DataType.TEXT, unique: true})
    name: string;

    @ForeignKey(() => Academy)
    @Column
    academyId: number;

    @BelongsTo(() => Academy)
    academy: Academy;

    @HasMany(() => StudentClass, { onDelete: "CASCADE", onUpdate: "CASCADE", hooks: true })
    studentClasses: StudentClass[];

}