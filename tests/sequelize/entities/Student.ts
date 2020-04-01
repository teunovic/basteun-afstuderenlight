import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import StudentClass from "./StudentClass";


@Table
export default class Student extends Model<Student> {

    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @Column({type: DataType.TEXT, unique: true})
    name: string;

    @ForeignKey(() => StudentClass)
    @Column
    studentClassId: number;

    @BelongsTo(() => StudentClass)
    studentClasses: StudentClass;

}