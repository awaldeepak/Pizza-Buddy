const express = require('express');
const app = express();
const PORT = process.env.PORT || 3300;
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');


app.use(express.static('assets'));


//Set Template Engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


//Display home view at root route
app.get('/', (req, res) => {

    return res.render('home', {
        title: 'Home'
    });

});

app.get('/cart', (req, res) => {

    return res.render('customers/cart');
});

app.get('/register', (req, res) => {

    return res.render('auth/register');
});

app.get('/login', (req, res) => {

    return res.render('auth/login');
});




//Listen Server on Port 8000
app.listen(PORT, (err) => {
    if(err){ console.log(`Error: ${err}`); }

    console.log(`Server is up and running on port ${PORT}`);
    
});