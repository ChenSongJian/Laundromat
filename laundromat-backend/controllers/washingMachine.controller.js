const { StatusCodes } = require("http-status-codes");
const WashingMachineState = require('../enum/washingMachineState.enum.js');
const WashingMachine = require('../models/washingMachine.model.js');
const WashJobHistory = require("../models/washJobHistory.model.js");
const { removeCurrentJobWashingMachine } = require('../services/washingMachine.service.js');
const getWashingMachineStatistics = require('../services/washJobHistory.service.js');
const { defaultCoinTypes, defaultWashTypes } = require('../setup/defaultData.js');


async function getWashingMachineByWashingMachineId(washingMachineId, res) {
    if (isNaN(washingMachineId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine id should be integer!' });
    }
    const washingMachine = await WashingMachine.findOne({ washingMachineId: washingMachineId });
    if (!washingMachine) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Washing machine not found!' });
    }
    return washingMachine;
}

const getByWashingMachineId = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        return res.status(StatusCodes.OK).json({washingMachine});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const getStatistics = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (washingMachine.state !== WashingMachineState.MaintenanceMode) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine is not in maintenance mode!'});
        }
        var jobCompleted = null;
        if (req.query.job_completed === undefined) {
            jobCompleted = null;
        } else if (['true', 'yes', '1'].includes(req.query.job_completed.toLowerCase())) {
            jobCompleted = true;
        } else if (['false', 'no', '0'].includes(req.query.job_completed.toLowerCase())) {
            jobCompleted = false;
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid job completed value!'});
        }
        const lastResetTime = washingMachine.lastResetTime;
        const { totalEarningCent, totalDurationSecond } = await getWashingMachineStatistics(lastResetTime, jobCompleted);
        return res.status(StatusCodes.OK).json({
            total_earning_cent: totalEarningCent, 
            total_duration_second: totalDurationSecond
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const resetStatistics = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (washingMachine.state !== WashingMachineState.MaintenanceMode) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine is not in maintenance mode!'});
        }
        washingMachine.lastResetTime = new Date();
        await washingMachine.save();
        res.status(StatusCodes.OK).json({ message: 'Reset washing machine statistics successfully!'});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const powerOffWashingMachine = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (washingMachine.state === WashingMachineState.Off) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine is already off!'});
        }
        var refundValueCent = 0
        if (washingMachine.state === WashingMachineState.WashInProgress 
            || washingMachine.state === WashingMachineState.PendingContinue
        ) {
            washingMachine.state = WashingMachineState.Off;
            await washingMachine.save();
        } else {
            refundValueCent = washingMachine.currentInsertedValueCent;
            washingMachine.state = WashingMachineState.Off;
            removeCurrentJobWashingMachine(washingMachine);
        }
        res.status(StatusCodes.OK).json({ message: 'Power off washing machine successfully!', refund_value_cent: refundValueCent});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const powerOnWashingMachine = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (washingMachine.state !== WashingMachineState.Off) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine is not off!'});
        }
        if (washingMachine.currentJobStartTime) {
            washingMachine.state = WashingMachineState.PendingContinue;
        } else {
            washingMachine.state = WashingMachineState.Idle;
        }
        await washingMachine.save();
        res.status(StatusCodes.OK).json({ message: 'Power on washing machine successfully!'});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const selectWashType = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (washingMachine.state !== WashingMachineState.Idle) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine is not idle!'});
        }
        var isValidWashTypes = false
        var currentJobPriceCent = 0
        var currentJobTotalTimeSecond = 0
        for (const washType of defaultWashTypes) {
            if (washType.type === req.body.wash_type) {
                isValidWashTypes = true;
                currentJobPriceCent = washType.priceCent;
                currentJobTotalTimeSecond = washType.durationSecond;
                break;
            }
        }
        if (!isValidWashTypes) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid wash type!'});
        }
        washingMachine.currentJobName = req.body.wash_type;
        washingMachine.currentJobTotalTimeSecond = currentJobTotalTimeSecond;
        washingMachine.state = WashingMachineState.WashTypeSelected;
        washingMachine.currentInsertedValueCent = washingMachine.currentInsertedValueCent || 0;
        washingMachine.currentJobPriceCent = currentJobPriceCent;
        await washingMachine.save();
        remainingValueCent = washingMachine.currentJobPriceCent - washingMachine.currentInsertedValueCent;
        res.status(StatusCodes.OK).json({ message: 'Select wash type successfully!', remaining_value_cent: remainingValueCent});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const insertCoin = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (washingMachine.state !== WashingMachineState.WashTypeSelected) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine is not in wash type selected state!'});
        }
        const req_coin_value_cent = parseFloat(req.body.coin_value_cent);
        const isValidCoinValue = defaultCoinTypes.some(coinType => coinType.value === req_coin_value_cent);
        if (!isValidCoinValue) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid coin value!'});
        }
        washingMachine.currentInsertedValueCent += req_coin_value_cent;
        remainingValueCent = washingMachine.currentJobPriceCent - washingMachine.currentInsertedValueCent;
        if (washingMachine.currentInsertedValueCent >= washingMachine.currentJobPriceCent) {
            washingMachine.state = WashingMachineState.PendingStart;
        }
        await washingMachine.save();
        res.status(StatusCodes.OK).json({ message: 'Insert coin successfully!', remaining_value_cent: remainingValueCent});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const cancelWash = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (!(washingMachine.state === WashingMachineState.WashTypeSelected 
            || washingMachine.state === WashingMachineState.PendingStart 
            || washingMachine.state === WashingMachineState.PendingContinue)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine is not in wash type selected, pending start or pending continue state!'});
        }
        
        if (washingMachine.state === WashingMachineState.PendingContinue) {
            const washJobRecord = new WashJobHistory({
                jobName:  washingMachine.currentJobName,
                jobDurationSecond: washingMachine.currentJobTotalTimeSecond - washingMachine.currentJobRemainingTimeSecond,
                jobEarningCent:  washingMachine.currentJobPriceCent,
                jobStartTime: washingMachine.currentJobStartTime,
                jobEndTime: new Date(),
                jobCompleted:  false
            });
            await washJobRecord.save();
        }

        refundValueCent = washingMachine.currentInsertedValueCent;
        washingMachine.state = WashingMachineState.Idle;
        await removeCurrentJobWashingMachine(washingMachine);
        res.status(StatusCodes.OK).json({ message: 'Cancel wash successfully!', refund_value_cent: refundValueCent});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const startWash = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (!washingMachine.doorClosed) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine door is not closed!'});
        }
        if (washingMachine.state !== WashingMachineState.PendingStart) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine is not in pending start state!'});
        }
        washingMachine.state = WashingMachineState.WashInProgress;
        washingMachine.currentJobStartTime = new Date();
        const refundValueCent = washingMachine.currentInsertedValueCent - washingMachine.currentJobPriceCent;
        washingMachine.currentInsertedValueCent = undefined;
        washingMachine.currentJobRemainingTimeSecond = washingMachine.currentJobTotalTimeSecond;
        washingMachine.currentJoblastProgressUpdateTime = new Date();
        await washingMachine.save();
        res.status(StatusCodes.OK).json({ message: 'Start wash successfully!', refund_value_cent: refundValueCent});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const continueWash = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (washingMachine.state !== WashingMachineState.PendingContinue) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine is not in pending continue state!'});
        }
        washingMachine.state = WashingMachineState.WashInProgress;
        washingMachine.currentJoblastProgressUpdateTime = new Date();
        await washingMachine.save();
        res.status(StatusCodes.OK).json({ message: 'Continue wash successfully!'});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const enterMaintenanceMode = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (washingMachine.state !== WashingMachineState.Idle) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine is not idle!'});
        }
        washingMachine.state = WashingMachineState.MaintenanceMode;
        await washingMachine.save();
        res.status(StatusCodes.OK).json({ message: 'Enter maintenance mode successfully!'});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const openDoor = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (washingMachine.doorClosed === false) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine door is already open!'});
        }
        if (washingMachine.currentJobStartTime) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine has ongoing job!'});
        }
        washingMachine.doorClosed = false;
        await washingMachine.save();
        res.status(StatusCodes.OK).json({ message: 'Open washing machine door successfully!'});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const closeDoor = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (washingMachine.doorClosed === true) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine door is already closed!'});
        }
        washingMachine.doorClosed = true;
        await washingMachine.save();
        res.status(StatusCodes.OK).json({ message: 'Close washing machine door successfully!'});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

const exitMaintenanceMode = async(req, res) => {
    try {
        const washingMachineId = parseInt(req.params.washingMachineId);
        const washingMachine = await getWashingMachineByWashingMachineId(washingMachineId, res);
        if (washingMachine.state !== WashingMachineState.MaintenanceMode) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Washing machine is not in maintenance mode!'});
        }
        washingMachine.state = WashingMachineState.Idle;
        await washingMachine.save();
        res.status(StatusCodes.OK).json({ message: 'Exit maintenance mode successfully!'})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        console.log(error);
    }
}

module.exports = { 
    getByWashingMachineId, 
    getStatistics, 
    resetStatistics, 
    powerOffWashingMachine,
    powerOnWashingMachine,
    selectWashType,
    insertCoin,
    cancelWash,
    startWash,
    continueWash,
    enterMaintenanceMode,
    exitMaintenanceMode,
    openDoor,
    closeDoor
};