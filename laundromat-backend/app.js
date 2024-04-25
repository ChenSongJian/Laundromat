require('dotenv').config();
const cors = require('cors');
const express = require('express');
const setupDatabase = require('./setup/databaseSetup.js');
const initTaskScheduler = require('./setup/taskSchedulerSetup.js');
const coinTypesRouter = require('./routes/coinType.route.js');
const washTypesRouter = require('./routes/washType.route.js');
const washingMachineRouter = require('./routes/washingMachine.route.js');

const app = express();
const port = process.env.SERVER_PORT || 8080;


setupDatabase()
.then(() => {
  // initialise the task scheduler to update washing progress
  initTaskScheduler();

  app.use(express.json());
  // allow the frontend running on port 3000 to access the server
  app.use(cors(
    {
      origin: 'http://localhost:3000'
    }
  ));

  app.use('/api/coin_types', coinTypesRouter);
  app.use('/api/wash_types', washTypesRouter);
  app.use('/api/washing_machine', washingMachineRouter);
  
  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
})
.catch(error => {
  console.error('Error setting up database and starting server:', error);
  process.exit(1);
});