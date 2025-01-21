const express = require('express');
const config = require('./config/app');
const cors = require('cors');
const router = require('./router');
const statusMonitor = require('express-status-monitor');

const port = config.appPort;
const app = express()
app.use(statusMonitor());
app.use(express.json());
app.use(cors());
app.use(router);
app.listen(port,() =>{

    console.log(`Server listening on port ${port}`);
})
