const express = require('express');
const app = express()
app.use(express.json());  
const db=require('./config/db')
const redis=require('./config/redis')
const startReminderCron = require("./reminderCron");
const dotenv = require("dotenv");
dotenv.config();

const port = 3000;
// Start the cron job
startReminderCron();

const userAuth=require('./routes/auth');
const jobRoute=require('./routes/jobs')


app.use('/user',userAuth);
app.use('/job',jobRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})