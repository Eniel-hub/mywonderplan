require('dotenv').config();
const helper = require('../utils/helper');
const mysql = require('mysql2')
const mySQLStore = require('express-mysql-session');
const sessionDbConfig = require('../_db/db.config')[1];
const userService = require('../../src/apps/user/user.service');

const Initialize = (app, passport, session) =>{
    app.use(session({
        Key: 'this_is_the_key',
        secret: process.env.SESSION_SECRET,
        store: new mySQLStore(sessionDbConfig),
        resave: false,
        saveUninitialized: false,
        cookie:{
            secure: true,
            maxAge: 1000*60*60*5 //ms*s*min*hours 5hours
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());

}

//middleware

const CheckPassword = (password, hash, salt) => {
    var hashVerify = helper.toHash(password, salt)
    return hash === hashVerify;
}

const GetUser = async ({username}) => {
    if(username){
        try {
            const [user, ] = await userService.GetUser(username);
            return user;
        } catch (err) {
            console.log(`error while getting user by name : ${err.message}`);
        }
    }
}



module.exports = {
    CheckPassword,
    Initialize,
    GetUser
}