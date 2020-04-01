import {Sequelize} from "sequelize-typescript";
import University from "./entities/University";
import Academy from "./entities/Academy";
import Student from "./entities/Student";
import StudentClass from "./entities/StudentClass";
import StudyProgramme from "./entities/StudyProgramme";
import * as os from "os-utils";
import CPUTimer from "../CPUTimer";

const INCLUDES = [{ model: Academy, as: 'academies', include: [{ model: StudyProgramme, as: 'studyProgrammes', include: [{ model: StudentClass, as: 'studentClasses', include: [{ model: Student, as: 'students'}]}]}]}];

describe('Sequelize tests', () => {

    let sequelize: Sequelize;
    let timings = {create: -1, readWithRelations: -1, u: -1, d: -1};

    before(async function() {
        this.timeout(30000);
        sequelize = new Sequelize({
            database: 'afstuderenlight_sequelize',
            dialect: 'mysql',
            username: 'root',
            password: '',
            models: [__dirname + '/entities/**/*.ts'], // or [Player, Team],
            logging: false
        });
        await sequelize.sync();
        await Student.destroy({ where: {} });
        await StudentClass.destroy({ where: {} });
        await StudyProgramme.destroy({ where: {} });
        await Academy.destroy({ where: {} });
        await University.destroy({ where: {} });

    });

    after(async () => {
        await sequelize.close();
    });

    it('should check create time sequelize', async function() {
        this.timeout(30000);
        let universities = [];

        let studentId = 1;
        for(let i1 = 1; i1 <= 4; i1++) {
            let uni = {
                name: 'University ' + i1,
                academies: []
            };
            for(let i2 = 1; i2 <= 3; i2++) {
                let aca = {
                    name: 'uni' + i1 + ' Academy ' + i2,
                    studyProgrammes: []
                };
                (uni.academies as any).push(aca);
                for(let i3 = 1; i3 <= 4; i3++) {
                    let pro = {
                        name: 'uni' + i1 + 'a' + i2 + ' Programme ' + i3,
                        studentClasses: []
                    };
                    (aca.studyProgrammes as any).push(pro);
                    for(let i4 = 1; i4 <= 5; i4++) {
                        let cls = {
                            name: 'uni' + i1 + 'a' + i2 + 'p' + i3 + ' Class ' + i4,
                            students: []
                        };
                        (pro.studentClasses as any).push(cls);
                        for(let i5 = 1; i5 <= 30; i5++) {
                            let stu = {
                                name: 'Student ' + (studentId++)
                            };
                            (cls.students as any).push(stu);
                        }
                    }
                }
            }
            universities.push(uni);
        }

        let cpuTimer = new CPUTimer();
        cpuTimer.startTimer();
        let ms = +new Date();
        await University.bulkCreate(universities, { include: INCLUDES});
        timings.create = (+new Date()) - ms;
        console.log('Creating took ' + timings.create + 'ms');
        console.log('CPU average: ' + cpuTimer.getResult() + '%');
    });

    let universities: University[] = [];
    it('should check sequelize read speed', async function() {
        this.timeout(30000);

        let cpuTimer = new CPUTimer();
        cpuTimer.startTimer();
        let ms = +new Date();
        universities = (await University.findAll({ include: INCLUDES })).map(u => (u as any).dataValues);
        timings.readWithRelations = (+new Date()) - ms;
        console.log('Reading took ' + timings.readWithRelations + 'ms');
        console.log('CPU average: ' + cpuTimer.getResult() + '%');
    });

    it('should check sequelize update nested items speed', async function() {
        console.error('Sequelize does not support nested bulk update');
    });

    it('should check sequelize update 7200 non-nested items speed', async function() {
        this.timeout(300000);

        let students = [];

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
        let cpuTimer = new CPUTimer();
        cpuTimer.startTimer();
        let ms = +new Date();
        await Student.bulkCreate(students, { updateOnDuplicate: ['name'], fields: ['id', 'name'] });
        timings.u = (+new Date()) - ms;
        console.log('Updating 7200 non-nested took ' + timings.u + 'ms');
        console.log('CPU average: ' + cpuTimer.getResult() + '%');
    });

    it('should check sequelize delete speed', async function() {

        let cpuTimer = new CPUTimer();
        cpuTimer.startTimer();
        let ms = +new Date();
        await Student.destroy({ where: {} });
        await StudentClass.destroy({ where: {} });
        await StudyProgramme.destroy({ where: {} });
        await Academy.destroy({ where: {} });
        await University.destroy({ where: {} });
        timings.d = (+new Date()) - ms;
        console.log('Deleting took ' + timings.u + 'ms');
        console.log('CPU average: ' + cpuTimer.getResult() + '%');
    });



});