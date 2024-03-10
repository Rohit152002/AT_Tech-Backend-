const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const port = 8500;
const host = 'localhost';

const mongooseUrl = "mongodb+srv://johnnynaorem7:johnny02@hackcluster.agwzbmf.mongodb.net/Sports_App?retryWrites=true&w=majority";

app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./Routes/auth'))
app.use('/api/auth', require('./Routes/player'))
app.use('/api/auth', require('./Routes/event'))

mongoose.connect(mongooseUrl, {
  useNewUrlParser: true
})
.then(() => {
  app.listen(port, host, () => {
    console.log(`Server has been running at ${host}: ${port}`)
  })
})
.catch(err => console.log(err.message))