import React from 'react';

const MaintenanceState = ({ totalDurationSecond, totalEarningCent, handleResetStatisticsButtonClick, handleExitMaintenanceButtonClick }) => {
  const totalHours = Math.floor(totalDurationSecond / 3600);
  const totalMinutes = Math.floor((totalDurationSecond % 3600) / 60);
  const totalSeconds = totalDurationSecond % 60
  const totalEarningDollar = (totalEarningCent / 100).toFixed(2);
  return (
    <div>
      <h2>Total Time switched on (washing): {totalHours} hour(s) {totalMinutes} minute(s) {totalSeconds} second(s)</h2>
      <h2>Total Earning: ${totalEarningDollar}</h2>
      <button onClick={() => handleResetStatisticsButtonClick()}>Reset statistics</button>
      <button onClick={() => handleExitMaintenanceButtonClick()}>Exit Maintenance Mode</button>
    </div>
  );
};

export default MaintenanceState;