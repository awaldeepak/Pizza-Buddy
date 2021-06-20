const homeController = require('../controllers/home_controller');
const authController = require('../controllers/auth_controller');
const cartController = require('../controllers/customers/cart_controller');

function initRoutes(app) {

    //Display home view at root route
    app.get('/', homeController().index);

    app.get('/register', authController().register);

    app.get('/login', authController().login);

    app.get('/cart', cartController().cart);

    app.post('/update-cart', cartController().update);

}


module.exports = initRoutes;