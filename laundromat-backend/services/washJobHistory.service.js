const JobHistory = require('../models/washJobHistory.model.js');

async function getWashingMachineStatistics(lastResetTime, jobCompleted) {
    return new Promise((resolve, reject) => {
        var matchingConditions = {
            jobEndTime: { $gt: lastResetTime }
        }

        if (jobCompleted !== null) {
            matchingConditions.jobCompleted = jobCompleted;
        }

        JobHistory.aggregate([
            {
                $match: matchingConditions
            },
            {
                $group: {
                    _id: null,
                    totalEarningCent: { $sum: "$jobEarningCent" },
                    totalDurationSecond: { $sum: "$jobDurationSecond" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalEarningCent: 1,
                    totalDurationSecond: 1
                }
            }
        ]).exec()
        .then(result => {
            console.log('Result:', result);
            const totalEarningCent = result[0]?.totalEarningCent || 0;
            const totalDurationSecond = result[0]?.totalDurationSecond || 0;
            resolve({ totalEarningCent, totalDurationSecond });
        })
        .catch(err => {
            console.error('Error:', err);
            reject(err);
        });
    });
}

module.exports = getWashingMachineStatistics;
