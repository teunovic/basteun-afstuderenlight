import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import University from "./University";
import StudyProgramme from "./StudyProgramme";


@Table
export default class Academy extends Model<Academy> {

    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @Column({type: DataType.TEXT, unique: true})
    name: string;

    @ForeignKey(() => University)
    @Column
    universityId: number;

    @BelongsTo(() => University, { onDelete: "CASCADE" })
    university: University;

    @HasMany(() => StudyProgramme, { onUpdate: "CASCADE" })
    studyProgrammes: StudyProgramme[];

}