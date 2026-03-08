const ordersService = require('./orders_service');
const {
    createrOrderSchema,
    updateOrderSchema
} = require('./orders_schema');

class OrdersController{
    async createrOrder(req, res){
        try{
            const data = createrOrderSchema.parse(req.body);

            const order = await ordersService.createOrder({
                userId : req.user.id,
                name : data.name,
                items : data.items
            });

            return res.status(200).json({
                message : "Order created successfully",
                data : order
            })
        }catch(err){
            return res.status(400).json({
                message : `Error creating order`,
                error : err
            })
        }
    }

    async updateOrder(req,res){
        try{
            const data = updateOrderSchema.parse(req.body);

            const order = await ordersService.updateOrder({
                orderId : req.params.id,
                orderData : data
            })

            return res.status(200).json({
                message : "Order updated successfully",
                data : order
            })
        }catch(err){
            return res.status(400).json({
                message : `Error updating order`,
                error : err
            })
        }
    }

    async deleteOrder(req,res){
        try{
            await ordersService.deleteOrder({orderId : req.params.id});

            return res.status(200).json({
                message : "Order deleted successfully"
            })
        }catch(err){
            return res.status(400).json({
                messsage : `Error deleting order`,
                error : err
            })
        }
    }

    async getAllOrders(req,res){
        try{
            const orders = await ordersService.findAllOrders();

            return res.status(200).json({
                message : "Orders retrieved successfully",
                data : orders
            })
        }catch(err){
            return res.status(400).json({
                message : `Error retrieving orders`,
                error : err
            })
        }
    }

    async getOrders(req,res){
        try{
            const parsedFilters = findOrdersSchema.parse(req.query);

            const orders = await ordersService.findOrders(parsedFilters);

            return res.status(200).json({
                message : "Orders retrieved successfully",
                data : orders
            })
        }catch(err){
            return res.status(400).json({
                message : `Error retrieving orders`,
                error : err
            })
        }
    }
}

module.exports = new OrdersController();