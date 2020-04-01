import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import Academy from "./Academy";


@Table
export default class University extends Model<University> {

    @Column({primaryKey: true, autoIncrement: true, type: DataType.INTEGER})
    id: number;

    @Column({type: DataType.TEXT, unique: true})
    name: string;

    @HasMany(() => Academy, { onUpdate: "CASCADE"})
    academies: Academy[];






}