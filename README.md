# Node Library

A library management application using the backend of [Node.Js](https://nodejs.org/en/), [Express.Js](https://expressjs.com/), and [MongoDB](https://www.mongodb.com/). 

To run the app on your local machine simply run

    npm i
    npm start

***Make sure node.js, and mongoDB are installed on your local machine before running the script***

## Authentication
Authentication in this module is done by [Passport.Js](http://www.passportjs.org/docs/authenticate/)

    npm i passport --save

 using local strategy

    passport.use(new LocalStrategy({ 
	    usernameField: 'email', 
	    passwordField: 'passwd' 
    }, function(username, password, done) { 
     //...
      } ));

## Mongodb Connection
 Mongodb connection is done using the middleware mongoosejs
 

    const mongoose = require('mongoose'); 
    
    mongoose.connect('mongodb://localhost:27017/test'{useNewUrlParser: true});

## Environment variables
You can also use environment variables as per your need, for eg

    node app.js PORT=7777

Or initialize them using a .env file
