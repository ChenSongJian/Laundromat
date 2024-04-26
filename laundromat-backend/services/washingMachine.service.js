const WashingMachineState = require('../enum/washingMachineState.enum.js');
const WashingMachine = require('../models/washingMachine.model.js');

async function removeCurrentJobWashingMachine(washingMachine) {
    washingMachine.currentJobStartTime = undefined;
    washingMachine.currentInsertedValueCent = undefined;
    washingMachine.currentJobName = undefined;
    washingMachine.currentJobPriceCent = undefined;
    washingMachine.currentJobTotalTimeSecond = undefined;
    washingMachine.currentJobRemainingTimeSecond = undefined;
    washingMachine.currentJoblastProgressUpdateTime = undefined;
    await washingMachine.save();
}

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

module.exports = { removeCurrentJobWashingMachine, getWashingMachineByWashingMachineId }