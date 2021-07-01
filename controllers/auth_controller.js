const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');


function authController() {

    const _getRedirectUrl = (req) => {

        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders';
    }

    return {

        register(req, res) {

            res.render('auth/register');
            
        },

        async postRegister(req, res) {
            const { name, email, password } = req.body;
            
            //Validate Request
            if(!name || !email || !password) {
                req.flash('error', 'All fields are required!');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register');
            }

            //Check if email is already exists
            User.exists({email: email}, (err, result) => {
                if(result){
                    req.flash('error', 'Email already exists');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }
            });

            //Hash password
            const hashedPasswords = await bcrypt.hash(password, 10);

            //Crete a user
            const user = new User({
                name: name,
                email: email,
                password: hashedPasswords
            });
            
            user.save().then((user) => {

                //Login


                return res.redirect('/');
            }).catch(err => {
                req.flash('error', 'Something went wrong');
                return res.redirect('/register');
            });


            console.log(req.body);
            
        },

        login(req, res) {

            res.render('auth/login');

        },

        postLogin(req, res, next) {

            const { email, password } = req.body;
            
            //Validate Request
            if(!email || !password) {
                req.flash('error', 'All fields are required!');
                return res.redirect('/login');
            }
            
            passport.authenticate('local', (err, user, msgInfo) => {
                if(err) {
                    req.flash('error',msgInfo.message);
                    return next(err);
                }

                if(!user) {
                    req.flash('error',msgInfo.message);
                    return res.redirect('/login');
                }

                req.logIn(user, () => {
                    if(err) {
                        req.flash('error',msgInfo.message);
                        return next(err);
                    }

                    return res.redirect(_getRedirectUrl(req));

                });

            })(req, res, next);

        },

        logout(req, res) {
            req.logout();
            return res.redirect('/login');
        }

    }
}


module.exports = authController;