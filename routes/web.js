const homeController = require('../controllers/home_controller');
const authController = require('../controllers/auth_controller');
const cartController = require('../controllers/customers/cart_controller');
const guest = require('../middlewares/guest');


function initRoutes(app) {

    //Display home view at root route
    app.get('/', homeController().index);

    app.get('/register', guest, authController().register);

    app.post('/register', authController().postRegister);

    app.get('/login', guest, authController().login);

    app.post('/login', authController().postLogin);

    app.post('/logout', authController().logout);

    app.get('/cart', cartController().cart);

    app.post('/update-cart', cartController().update);

}


module.exports = initRoutes;