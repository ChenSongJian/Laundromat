const WashingMachineDoor = ({washingMachineInfo, onDoorUpdate, setDoorErrorMessage}) => {
  const handleDoorButtonClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/washing_machine/1/${washingMachineInfo.doorClosed?"open":"close"}_door`, 
        { method: 'POST'}
      );
      if (response.ok) {
        await setDoorErrorMessage(null);
        await onDoorUpdate();
      } else {
        console.error('Error toggling door:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling door:', error);
    }
  };

  return (
    <div className="washingMachineDoor">
      <h2>Washing Machine Door {washingMachineInfo.doorClosed? "Closed": "Open"}</h2>
      <button 
        onClick={handleDoorButtonClick}
        disabled={washingMachineInfo.currentJobStartTime}
      >
        {washingMachineInfo.doorClosed? "Open": "Close"} door
      </button>
    </div>
  )  

};

export default WashingMachineDoor;