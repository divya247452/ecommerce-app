const Order = require('../models/orderModel.js');;
const Product = require('../models/productModel.js');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async ( req, res ) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;
        if(orderItems && orderItems.length === 0){
            res.status(400).json({message: "No Orders"})
        } else{
            const order = new Order({
                orderItems: orderItems.map((x) => ({
                    ...x,
                    product: x._id,
                    _id: undefined
                })),
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            });
            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(400).json({message: error})
    }
}

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async ( req, res ) => {
    try {
       const orders = await Order.find({ user: req.user._id})
       res.status(200).json(orders)     
    } catch (error) {
        res.status(400).json({message: error})
    }
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async ( req, res ) => {
    try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(order){
        res.status(200).json(order)
    } else {
        res.status(404).json({message: "Order not found"})
    }
    } catch (error) {
        res.status(400).json({message: error})
    }
}

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async ( req, res ) => {
    try {
        const order = await Order.findById(req.params.id)        

        if(order){
            order.isPaid = true,
            order.paidAt = Date.now(),
            order.paymentResult = {
                id : req.body.id,
                status : req.body.status,
                update_time : req.body.update_time,
                email_address : req.body.email_address
            }
            const updatedOrder = await order.save();
            res.status(200).json(updatedOrder)
        } else {
            res.status(404).json({message: "Order not found"})
        }
    } catch (error) {
        res.status(400).json({message: error})
    }
}
// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async ( req, res ) => {
    try {
        res.send( "update order to delivered")
       
        
    } catch (error) {
        res.status(400).json({message: error})
    }
}

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async ( req, res ) => {
    try {
        res.send( "get all orders")
       
        
    } catch (error) {
        res.status(400).json({message: error})
    }
}


module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
