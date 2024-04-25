const express = require('express');
const washingMachineRouter = express.Router();
const {
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
} = require('../controllers/washingMachine.controller.js');

// endpoints to get washing machine info
washingMachineRouter.get('/:washingMachineId', getByWashingMachineId);
washingMachineRouter.get('/:washingMachineId/statistics', getStatistics);

// endpoints to update washing machine info and/or state, no direct update allowed to prevent invalid operations
washingMachineRouter.post('/:washingMachineId/reset_statistics', resetStatistics);
washingMachineRouter.post('/:washingMachineId/power_off', powerOffWashingMachine);
washingMachineRouter.post('/:washingMachineId/power_on', powerOnWashingMachine);
washingMachineRouter.post('/:washingMachineId/select_wash_type', selectWashType);
washingMachineRouter.post('/:washingMachineId/insert_coin', insertCoin);
washingMachineRouter.post('/:washingMachineId/cancel_wash', cancelWash);
washingMachineRouter.post('/:washingMachineId/start_wash', startWash);
washingMachineRouter.post('/:washingMachineId/continue_wash', continueWash);
washingMachineRouter.post('/:washingMachineId/enter_maintenance_mode', enterMaintenanceMode);
washingMachineRouter.post('/:washingMachineId/exit_maintenance_mode', exitMaintenanceMode); 
washingMachineRouter.post('/:washingMachineId/open_door', openDoor);
washingMachineRouter.post('/:washingMachineId/close_door', closeDoor); 

module.exports = washingMachineRouter
