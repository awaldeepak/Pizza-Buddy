require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3300;
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');

//Database Connection
const url = 'mongodb://localhost/pizza-buddy'
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log("Conncetion Failed...");
});


//Session store
// let mongoStore = new MongoStore({
//     mongooseConnection: connection,
//     collection: 'sessions'
// });


//Session configuration
app.use(session({
    secret: 'process.env.COOKIE_SECRET',
    resave: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/pizza-buddy',
        collectionName: 'sessions'
    }),
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24} //24 hours
}));

app.use(flash());


//Assets
app.use(express.static('assets'));

//To Process JSON data from server
app.use(express.json());

//Set Global locals middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

//Set Template Engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


require('./routes/web')(app);


//Listen Server on Port 8000
app.listen(PORT, (err) => {
    if(err){ console.log(`Error: ${err}`); }

    console.log(`Server is up and running on port ${PORT}`);
    
});