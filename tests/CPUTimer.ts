import * as os from "os";

function cpuAverage() {

    //Initialise sum of idle and time of cores and fetch CPU info
    var totalIdle = 0, totalTick = 0;
    var cpus = os.cpus();

    //Loop through CPU cores
    for(var i = 0, len = cpus.length; i < len; i++) {

        //Select CPU core
        var cpu = cpus[i];

        //Total up the time in the cores tick
        for(let type in cpu.times) {
            totalTick += (cpu.times as any)[type];
        }

        //Total up the idle time of the core
        totalIdle += cpu.times.idle;
    }

    //Return the average Idle and Tick times
    return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

export default class CPUTimer {

    private start: any;

    startTimer() {
        this.start = cpuAverage();
    }

    getResult(): number {

        let endMeasure = cpuAverage();

        //Calculate the difference in idle and total time between the measures
        var idleDifference = endMeasure.idle - this.start.idle;
        var totalDifference = endMeasure.total - this.start.total;

        return 100 - ~~(100 * idleDifference / totalDifference);
    }

}