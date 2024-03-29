const Order = require('../../models/Order');
const moment = require('moment');

function orderController() {

    return {

        store (req, res) {

            const { phone, address } = req.body;
            if(!phone || !address) {

                req.flash('error', 'Phone and Address are required');
                req.flash('phone', phone);
                req.flash('address', address);
                return res.redirect('/cart');
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: phone,
                address: address
            });

            order.save().then(result => {

                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {

                    req.flash('success', 'Order placed successfully');
                    delete req.session.cart;

                    // Emit Event
                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderPlaced', placedOrder); 

                    return res.redirect('/customer/orders');

                });

            }).catch(err => {
                req.flash('error', 'Something went wrong!');
                return res.redirect('/cart');
            }); 

        },

        async index(req, res) {

            const orders = await Order.find({ customerId: req.user._id }, null, {sort: {'createdAt': -1}});
            
            //To set header to not show the message "Order placed successfully" if we go back and forth
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

            return res.render('customers/orders', { 
                orders: orders,
                moment: moment
            });
        },

        async showOrder(req, res) {

            const order = await Order.findById(req.params.id)
            // Authorize User
            if (req.user._id.toString() === order.customerId.toString()) {

                return res.render('customers/singleOrder', {
                    order: order
                });
            } 
            
            return res.redirect('/');
            
        }
    }
}


module.exports = orderController;