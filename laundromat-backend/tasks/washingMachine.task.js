const mongoose = require('mongoose');
const CronJob = require('node-cron');

const WashingMachineState = require('../enum/washingMachineState.enum.js');
const WashingMachine = require('../models/washingMachine.model.js');
const WashJobHistory = require("../models/washJobHistory.model.js");
const { removeCurrentJobWashingMachine } = require('../services/washingMachine.service.js');

// update washing machine progress timer every 5 second
const washingMachineTimerUpdateTask = CronJob.schedule('*/5 * * * * *', async () => {
    // hardcoded washing machine id 1 since there is only one washing machine
    const washingMachine = await WashingMachine.findOne({ washingMachineId: 1 });
    console.info('washingMachineTimerUpdateTask: found washing machine:', washingMachine);
    if (washingMachine.state === WashingMachineState.WashInProgress) {
        // update washing machine job remaining time
        const newProgressUpdateTime = new Date();
        washingMachine.currentJobRemainingTimeSecond -= Math.floor((newProgressUpdateTime - washingMachine.currentJoblastProgressUpdateTime) / 1000);
        washingMachine.currentJoblastProgressUpdateTime = newProgressUpdateTime;
        console.info('washingMachineTimerUpdateTask: updated remaining time:', washingMachine.currentJobRemainingTimeSecond);
        await washingMachine.save();

        // if job completed then insert current job info into job history, and reset washing machine
        // else just update the job remaining time
        if (washingMachine.currentJobRemainingTimeSecond <= 0) {
            const washJobRecord = new WashJobHistory({
                jobName:  washingMachine.currentJobName,
                jobDurationSecond: washingMachine.currentJobTotalTimeSecond,
                jobEarningCent:  washingMachine.currentJobPriceCent,
                jobStartTime: washingMachine.currentJobStartTime,
                jobEndTime: new Date(),
                jobCompleted:  true
            });
            await washJobRecord.save();
            console.info('washingMachineTimerUpdateTask: saved wash job history:', washJobRecord);
            
            washingMachine.state = WashingMachineState.Idle;
            await removeCurrentJobWashingMachine(washingMachine);
        }
        console.info('washingMachineTimerUpdateTask: saved updated washing machine:', washingMachine);
    } else {
        console.info('washingMachineTimerUpdateTask: washing machine not in washing state, no update in progress')
    }
});

module.exports = { washingMachineTimerUpdateTask };