const express = require('express');
const app = express()
app.use(express.json());  
const db=require('./config/db')

const dotenv = require("dotenv");
dotenv.config();

const port = 3000;


const userAuth=require('./routes/auth');


app.use('/user',userAuth);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})