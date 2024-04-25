const WashingMachineState = Object.freeze({
    Off: 0,
    Idle: 1,
    WashTypeSelected: 2,
    PendingStart: 3,
    WashInProgress: 4,
    MaintenanceMode: 5,
    PendingContinue: 6
  });
  
module.exports = WashingMachineState;
