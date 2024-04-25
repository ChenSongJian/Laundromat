const WashingMachineState = require('../enum/washingMachineState.enum.js');

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

module.exports = { removeCurrentJobWashingMachine }