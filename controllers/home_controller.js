const Pizza = require('../models/Pizza')

function homeController() {

    return {

        async index(req, res) {

            let pizzas = await Pizza.find();

            res.render('home', {
                pizzas: pizzas
            });   
        }
    }
}


module.exports = homeController;