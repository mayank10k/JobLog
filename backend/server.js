const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const app = express()
app.use(express.json()); 
const db=require('./config/db')
const redis=require('./config/redis') 
const startReminderCron = require("./reminderCron");

const port = process.env.PORT || 5000;
// Start the cron job
startReminderCron();

const cors = require("cors");
// app.use(cors());

//for production
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const userAuth=require('./routes/auth');
const jobRoute=require('./routes/jobs')


app.use('/auth',userAuth);
app.use('/jobs',jobRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})