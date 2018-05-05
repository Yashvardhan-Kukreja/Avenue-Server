const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const DB = process.env.DB;
const port = process.env.PORT || 8000;
const app = express();

mongoose.connect(DB).exec(err => {
    if (err)
        console.log("Error occurred while connecting to the database ! ");
    else {

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(logger('dev'));

        app.use(helmet());
        app.use(compression());

        app.use((req, res, next) => {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use((err, req, res, next) => {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });

        app.listen(port, () => {
            console.log("App running successfully on port number: " + port + "...");
        });
    }
});