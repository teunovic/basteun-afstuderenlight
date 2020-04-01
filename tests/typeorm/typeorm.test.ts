
/*

    University
    |--Academy
    |--|--StudyProgramme
    |--|--|--StudentClass
    |--|--|--|--Student

 */


import {createConnection, In} from "typeorm";
import {Student} from "./entities/Student";
import {StudentClass} from "./entities/StudentClass";
import {StudyProgramme} from "./entities/StudyProgramme";
import {Academy} from "./entities/Academy";
import {University} from "./entities/University";



describe('TypeORM tests', () => {

    let db;
    let timings = {create: -1, readWithRelations: -1, updateNested: -1, updateNonNested: -1, delete: -1};

    before(async function() {
        this.timeout(10000);
        db = await createConnection({
            type: "mysql",
            host: "127.0.0.1",
            port: 3306,
            username: "root",
            password: "",
            database: "afstuderenlight_typeorm",
            synchronize: true,
            logging: true,
            logger: "file",
            entities: [
                __dirname + "/entities/*.ts"
            ]
        });

        await Student.delete({});
        await StudentClass.delete({});
        await StudyProgramme.delete({});
        await Academy.delete({});
        await University.delete({});
    });

    after(async function() {
        this.timeout(10000);
    });

    it('should check TypeORM create speed', async function() {
        this.timeout(30000);
        let studentId = 0;
        let universities: University[] = [];
        for(let i1 = 1; i1 <= 4; i1++) {
            let uni = new University();
            uni.name = 'University ' + i1;
            uni.academies = [];
            for(let i2 = 1; i2 <= 3; i2++) {
                let aca = new Academy();
                aca.university = uni;
                aca.name = 'uni' + i1 + 'aca' + i2;
                aca.studyProgrammes = [];
                uni.academies.push(aca);
                for(let i3 = 1; i3 <= 4; i3++) {
                    let pro = new StudyProgramme();
                    pro.academy = aca;
                    pro.name = 'uni' + i1 + 'aca' + i2 + 'pro' + i3;
                    pro.studentClasses = [];
                    aca.studyProgrammes.push(pro);
                    for(let i4 = 1; i4 <= 5; i4++) {
                        let cla = new StudentClass();
                        cla.studyProgramme = pro;
                        cla.name = 'uni' + i1 + 'aca' + i2 + 'pro' + i3 + ' class ' + i4;
                        cla.students = [];
                        pro.studentClasses.push(cla);
                        for(let i5 = 1; i5 <= 30; i5++) {
                            let stu = new Student();
                            stu.studentClass = cla;
                            stu.name = 'Student ' + (++studentId);
                            cla.students.push(stu);
                        }
                    }
                }
            }
            universities.push(uni);
        }
        let ms = +new Date;
        await University.save(universities);
        timings.create = (+new Date) - ms;
        console.log('Creation took ' + timings.create + 'ms');
    });

    let universities: University[] = [];
    it('should check TypeORM read speed', async function() {
        this.timeout(30000);

        let ms = +new Date();
        universities = await University.find({ loadEagerRelations: true });
        timings.readWithRelations = (+new Date()) - ms;
        console.log('Reading took ' + timings.readWithRelations + 'ms');
    });

    it('should check TypeORM update nested speed', async function() {
        this.timeout(300000);

        for(let uni of universities) {
            uni.name += ' updated';
            for(let aca of uni.academies) {
                aca.name += ' updated';
                for(let pro of aca.studyProgrammes) {
                    pro.name += ' updated';
                    for (let cla of pro.studentClasses) {
                        cla.name += ' updated';
                        for (let stu of cla.students) {
                            stu.name += ' updated';
                        }
                    }
                }
            }
        }

        let ms = +new Date();
        universities = await University.save(universities, { reload: false, transaction: true });
        timings.updateNested = (+new Date()) - ms;
        console.log('Updating took ' + timings.updateNested + 'ms');
    });

    it('should check TypeORM update 7200 items non-nested speed', async function() {
        this.timeout(300000);

        let students: Student[] = [];
        for(let uni of universities) {
            for(let aca of uni.academies) {
                for(let pro of aca.studyProgrammes) {
                    for (let cla of pro.studentClasses) {
                        for (let stu of cla.students) {
                            stu.name += ' updated';
                            students.push(stu);
                        }
                    }
                }
            }
        }

        let ms = +new Date();
        await Student.save(students, { reload: false, transaction: true });
        timings.updateNonNested = (+new Date()) - ms;
        console.log('Updating 7200 non-nested rows took ' + timings.updateNonNested + 'ms');
    });

    it('should check TypeORM delete speed', async function() {
        this.timeout(30000);

        let ms = +new Date();
        await University.delete({});
        timings.delete = (+new Date()) - ms;
        console.log('Deleting took ' + timings.delete + 'ms');
    });



});

