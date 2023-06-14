require('dotenv').config();
const express = require('express');
const passport = require('passport');
// const formdata = require('form-data');
const session = require('express-session');
const fileUpload = require('express-fileupload');

const userRoute = require('./src/apps/user/user.route');
const cityRoute = require('./src/apps/cities/city.route');
const regionRoute = require('./src/apps/regions/regions.route');
const activityRoute = require('./src/apps/activities/activities.route');
const transactionRoue = require('./src/apps/transactions/transactions.route');

const pportMiddleware = require('./src/auth/passport.middleware');
const pportController = require('./src/auth/passport.controller');


const app = express();

const PORT = process.env.PORT;

pportMiddleware.Initialize(app, passport, session);
pportController(passport);

app.use(express.urlencoded({ extended : true, }));
app.use(express.static('public'));
app.use(express.json());
app.use(
    fileUpload({
        limits: {
            fileSize: 10 * 1024 * 1024, //10Mo
        },
        abortOnLimit: true,
    })
);

app.use('/city', cityRoute);
app.use('/user',  userRoute);
app.use('/region', regionRoute);
app.use('/activity', activityRoute);
app.use('/transaction', transactionRoue);


app.listen(PORT, ()=>{
    console.log(`application running on port: http://localhost:${PORT}`)
})