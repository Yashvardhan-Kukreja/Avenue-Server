const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const authRouter = require("./routes/authRoutes");
const doctorRouter = require("./routes/doctorRoutes");

const DB = "mongodb://yash:yash@ds117749.mlab.com:17749/avenue" || process.env.DB;
const port = process.env.PORT || 8000;
const app = express();

mongoose.connect(DB, err => {
    if (err)
        console.log("Error occurred while connecting to the database ! ");
    else {

        console.log("Successfully connected to the database...");
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(logger('dev'));


        app.use('/authenticate', authRouter);
        app.use('/doctor', doctorRouter);

        app.listen(port, () => {
            console.log("App running successfully on port number: " + port + "...");
        });
    }
});