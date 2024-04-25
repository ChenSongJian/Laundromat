# Basic workflow
## Power Off
<p align="center">
    <img src="./images/power-off.png" width="100%">
</p>
Initial state, nothing is displayed, coins selection disabled, can open or close door
<br></br>
Turn on the power will enter Idle state

## Idle
<p align="center">
    <img src="./images/idle.png" width="100%">
</p>
User can select any wash type or enter maintenance mode 

## Wash Type Selected
<p align="center">
    <img src="./images/wash-type-selected.png" width="100%">
</p>
Display the selected job name and remaining fund required
<br></br>
<p align="center">
    <img src="./images/wash-type-selected-coin-inserted.png" width="100%">
</p>
Remaining value updates when coins are inserted

## Pending Start
<p align="center">
    <img src="./images/pending-start.png" width="100%">
</p>
Display the selected job name and time required, can start or cancel

## Washing In Progress
<p align="center">
    <img src="./images/washing-in-progress-with-refund.png" width="100%">
</p>
Display the wash job progress, door is locked, display refund value and ask user to collect

## Maintenance Mode
<p align="center">
    <img src="./images/maintenance-mode-with-completed-job.png" width="100%">
</p>
Check stats after wash job completed
<br></br>
<p align="center">
    <img src="./images/maintenance-mode-reset-stats.png" width="100%">
</p>
Statistics updated after reset

## Pending Continue
Turn off the washing machine when there is ongoing job
<p align="center">
    <img src="./images/power-off-with-ongoing-job.png" width="100%">
</p>
The door is still locked
<br></br>
Turn on the power again and it will display pending continue page
<br></br>
<p align="center">
    <img src="./images/pending-continue.png" width="100%">
</p>
User can choose to continue wash job or cancel wash job to go back idle state
<br></br>
<p align="center">
    <img src="./images/maintenance-mode-with-cancel-job.png" width="100%">
</p>
The time spent in the cancelled job is added too


# Other cases
## If door is open when trying to start a wash job 
<p align="center">
    <img src="./images/pending-start-starting-job-with-door-open.png" width="100%">
</p>
Prompt the user to close the door for 10 seconds or until user close the door, whichever is earlier

## Cancel a wash job before start washing
<p align="center">
    <img src="./images/idle-with-refund-from-cancel-job.png" width="100%">
</p>
Display refund value and ask user to collect

## Power off after inserting coins and before start washing
<p align="center">
    <img src="./images/power-off-with-refund.png" width="100%">
</p>
Display refund value and ask user to collect
