const mongoose = require('mongoose');
const database = require('../setup/databaseConnect.js');

const WashJobHistorySchema = mongoose.Schema(
    {
        jobName: {
            type: String,
            required: true
        },
        jobDurationSecond: {
            type: Number,
            required: true
        },
        jobEarningCent: {
            type: Number,
            required: true
        },
        jobStartTime: {
            type: Date,
            required: true
        },
        jobEndTime: {
            type: Date,
            required: true
        },
        jobCompleted: {
            type: Boolean,
            required: true
        }
    }
)

const WashJobHistory = database.model('wash_job_history', WashJobHistorySchema, 'wash_job_history');

module.exports = WashJobHistory;
