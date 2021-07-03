import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';
import moment from 'moment';


let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');


function updateCart(pizza) {
    axios.post('/update-cart', pizza).then((res) => {
        console.log(res);
        cartCounter.innerText = res.data.totalQty;

        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item Added to Cart',
            progressBar: false
          }).show();

    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something Went Wrong',
            progressBar: false
          }).show();
    });
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        
        updateCart(pizza);

    });
});

//Remove alert message after 2 seconds
const alertMsg = document.querySelector('#success-alert');
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove();
    }, 2000);
}


// Get order to change single order status
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);

let statuses = document.querySelectorAll('.status-line');

// To create a small for displaying time of a perticular step completed
let time = document.createElement('small');

// Change single order status
function updateStatus(order) {
    
    // To clear the existing classes to update the colors of the orders
    statuses.forEach((status) => {
        status.classList.remove('step-completed');
        status.classList.remove('current-status');
    });

    let stepCompleted = true;
    statuses.forEach((status) => {

        let dataProperty = status.dataset.status;
        if(stepCompleted) {

            status.classList.add('step-completed');
            
        }
        if(dataProperty === order.status) {
            
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);
            if(status.nextElementSibling) {
                status.nextElementSibling.classList.add('current-status');
            }
        }

    })
}


// Call updateStatus
updateStatus(order);


// Call Socket
let socket = io();


//Join Private Room
if(order) {
    socket.emit('join', `order_${ order._id }`); // socket.emmit(event_name, roomName)
}


//Socket for Updating Orders on Admin Orders page in real-time
const adminAreaPath = window.location.pathname;
if(adminAreaPath.includes('admin')) {

    //Call Admin
    initAdmin(socket);
    socket.emit('join', 'adminRoom');
}


//Event Emitter
socket.on('orderUpdatedFromServer', (data) => {
    const updatedOrder = { ...order };
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    updateStatus(updatedOrder);
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order Updated',
        progressBar: false
      }).show();
});

