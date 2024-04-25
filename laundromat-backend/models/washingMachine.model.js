const mongoose = require('mongoose');
const database = require('../setup/databaseConnect.js');

const WashingMachineSchema = mongoose.Schema(
    {
        washingMachineId: {
            type: Number,
            required: true
        },
        state: {
            type: Number,
            required: true
        },
        lastResetTime: {
            type: Date,
            required: true
        },
        doorClosed: {
            type: Boolean,
            required: true
        },
        currentInsertedValueCent: {
            type: Number
        },
        currentJobName: {
            type: String
        },
        currentJobPriceCent: {
            type: Number
        },
        currentJobStartTime: {
            type: Date
        },
        currentJobTotalTimeSecond: {
            type: Number
        },
        currentJobRemainingTimeSecond: {
            type: Number
        },
        currentJoblastProgressUpdateTime: {
            type: Date
        }
    }
)

const WashingMachine = database.model('washing_machine', WashingMachineSchema, 'washing_machine');

module.exports = WashingMachine;
