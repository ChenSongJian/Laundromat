const { washingMachineTimerUpdateTask } = require('../tasks/washingMachine.task.js');

const initTaskScheduler = () => {
    washingMachineTimerUpdateTask.start();
};

module.exports = initTaskScheduler;