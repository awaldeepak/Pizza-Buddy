const homeController = require('../controllers/home_controller');
const authController = require('../controllers/auth_controller');
const cartController = require('../controllers/customers/cart_controller');
const orderController = require('../controllers/customers/order_controller');
const adminOrderController = require('../controllers/admin/order_controller');
const adminStatusController = require('../controllers/admin/status_controller');

//Middlewares
const guest = require('../middlewares/guest');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');


function initRoutes(app) {

    //Common Routes
    app.get('/', homeController().index);

    app.get('/register', guest, authController().register);

    app.post('/register', authController().postRegister);

    app.get('/login', guest, authController().login);

    app.post('/login', authController().postLogin);

    app.post('/logout', authController().logout);

    app.get('/cart', cartController().cart);

    app.post('/update-cart', cartController().update);

    //Customer Routes
    app.post('/orders', auth, orderController().store);

    app.get('/customer/orders', auth, orderController().index);

    app.get('/customer/orders/:id', auth, orderController().showOrder);

    //Admin Routes
    app.get('/admin/orders', admin, adminOrderController().index);

    app.post('/admin/order/status', admin, adminStatusController().updateStatus);

}


module.exports = initRoutes;