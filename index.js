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
const passport = require('passport');
const Emitter = require('events');


//Database Connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});

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


// Event Emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);


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



//Passport config
const passportInit = require('./config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());



app.use(flash());


//Assets
app.use(express.static('assets'));

//To Parse URL's data from client
app.use(express.urlencoded({ extended: false }));

//To Process JSON data from server
app.use(express.json());

//Set Global locals middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});

//Set Template Engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


require('./routes/web')(app);

// Handling Page Not Found Error
app.use((req, res) => {
    return res.status(404).render('Errors/404', {
        layout: "Errors/404"
    });
});


//Listen Server on Port 8000
const server = app.listen(PORT, (err) => {
                    if(err){ console.log(`Error: ${err}`); }

                    console.log(`Server is up and running on port ${PORT}`);
                    
                });


// Socket for Updating Order Status on single order page at client side and Updating Orders on Admin Orders Page
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    
    // Join Private Room
    socket.on('join', (roomName) => {
        socket.join(roomName);
    });
});


//Event Emitter orderPlaced from customer/order_controller
eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdatedFromServer', data);
});


//Event Emitter orderPlaced from admin/order_controller
eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlacedFromServer', data);
});