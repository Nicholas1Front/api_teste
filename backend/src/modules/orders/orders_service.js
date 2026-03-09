const itemsService = require('../items/items_service');
const ordersRepository = require('./orders_repository');
const orderItemsRepository = require('./order_items/order_items_repository');

class OrdersService {
    async createOrder({
        userId,
        name,
        items
    }){
        let total_order_price = 0;

        for(const item of items){
            const itemFilters = {
                name : item.name
            }
            const existingItem = await itemsService.findItems(itemFilters);

            if(existingItem.length === 0){
                await itemsService.createItem({
                    name : item.name,
                    description : item.description,
                    price : item.price,
                    quantity : item.quantity
                });
            }
        }

        if(name === undefined){
            name = `Order user_ref : ${userId}, date_ref : ${new Date().toLocaleDateString()}`;
        }

        for(const item of items){
            const itemFilters = {
                name : item.name
            }
            const findedItem = await itemsService.findItems(itemFilters);

            const itemPrice = Number(findedItem[0].price);
            const itemQuantity = Number(item.quantity);

            total_order_price += itemPrice * itemQuantity;
        }

        const order = await ordersRepository.create({
            user_id : userId,
            name : name,
            total_price : total_order_price
        })

        if(!order || order.length === 0){
            throw new Error('Error creating order');
        }

        let finishedOrder = {
            id : order.id,
            user_id : order.user_id,
            name : order.name,
            total_price : order.total_price,
            items : []
        };

        for(const item of items){
            const itemFilters = {
                name : item.name
            }

            const findedItem = await itemsService.findItems(itemFilters);

            await orderItemsRepository.create({
                order_id : order.id,
                item_id : findedItem[0].id,
                quantity : item.quantity,
                price : findedItem[0].price
            })

            finishedOrder.items.push({
                id : findedItem[0].id,
                name : findedItem[0].name,
                description : findedItem[0].description,
                price : findedItem[0].price,
                quantity : item.quantity
            });

            await itemsService.updateItem({
                itemId : findedItem[0].id,
                itemData : {
                    quantity_available : findedItem[0].quantity_available - item.quantity
                }
            })
        }
        
        return finishedOrder;
    }

    async updateOrder({
        orderId,
        orderData
    }){
        const existingOrder = await ordersRepository.find({ id : orderId });

        if(existingOrder.length === 0){
            throw new Error("Order not found");
        }

        let updatedOrder = await ordersRepository.update({
            id : orderId,
            name : orderData.name,
            user_id : orderData.user_id
        });

        let finishedItems = [];

        if(orderData.items.length > 0){

            let total_order_price = 0;

            for(const item of orderData.items){

                const itemFilters = {
                    id : item.id
                }

                const findedItem = await itemsService.findItems(itemFilters);

                if(findedItem.length === 0){
                    throw new Error(`Item with id ${item.id} not found`);
                }

                const updatedOrderItem = await orderItemsRepository.update({
                    id : item.id,
                    order_id : orderId,
                    item_id : item.id,
                    quantity : item.quantity,
                    price : item.price
                });

                total_order_price += updatedOrderItem.price * updatedOrderItem.quantity;

                finishedItems.push({
                    id : findedItem[0].id,
                    name : findedItem[0].name,
                    description : findedItem[0].description,
                    price : findedItem[0].price,
                    quantity : updatedOrderItem.quantity
                })

                await itemsService.updateItem({
                    itemId : findedItem[0].id,
                    itemData : {
                        quantity_available : findedItem[0].quantity_available - updatedOrderItem.quantity
                    }
                })
            }

            updatedOrder = await ordersRepository.update({
                id : orderId,
                total_price : total_order_price
            })

        }

        return {
            id : updatedOrder.id,
            user_id : updatedOrder.user_id,
            name : updatedOrder.name,
            total_price : updatedOrder.total_price,
            items : finishedItems
        }
    }

    async deleteOrder({
        orderId
    }){
        const existingOrder = await ordersRepository.find({ id : orderId });

        if(existingOrder.length === 0){
            throw new Error("Order not found");
        }

        const orderItems = await orderItemsRepository.findByOrderId(orderId);

        if(orderItems.length > 0){
            for(const orderItem of orderItems){
                const deletedOrderItem = await orderItemsRepository.deleteByOrderId(orderItem.order_id);

                if(!deletedOrderItem){
                    throw new Error(`Error deleting order item with id ${orderItem.id}`);
                }
            }
        }

        const deletedOrder = await ordersRepository.delete(orderId);

        if(!deletedOrder){
            throw new Error("Error deleting order");
        }

        return true;
    }

    async findAllOrders(){
        let allOrders = await ordersRepository.findAll();

        if(allOrders.length === 0){
            return allOrders;
        }

        let finishedOrders = [];

        for(const order of allOrders){
            const orderItems = await orderItemsRepository.findByOrderId(order.id);

            const finishedOrder = {
                ...order,
                items : orderItems
            }

            finishedOrders.push(finishedOrder);
        }

        return finishedOrders;

    }

    async findOrders(filters){
        const orders = await ordersRepository.find({
            id : filters.id,
            user_id : filters.user_id,
            name : filters.name,
            total_price : filters.total_price
        })

        if(orders.length === 0){
            return orders;
        }

        let finishedOrders = [];

        for(const order of orders){
            const orderItems = await orderItemsRepository.findByOrderId(order.id);

            const finishedOrder = {
                ...order,
                items : orderItems
            }

            finishedOrders.push(finishedOrder);
        }

        return finishedOrders;
    }
}

module.exports = new OrdersService();