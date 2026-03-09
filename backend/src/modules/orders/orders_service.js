const itemsService = require('../items/items_service');
const ordersRepository = require('./orders_repository');
const orderItemsRepository = require('./order_items/order_items_repository');

class OrdersService {

    /*
     * Create Order
     *
     * Fluxo da criação de pedido:
     *
     * 1. Verifica se todos os itens enviados já existem no sistema.
     *    Caso não existam, eles são criados automaticamente.
     *
     * 2. Calcula o preço total do pedido com base no preço do item
     *    registrado no banco e na quantidade solicitada.
     *
     * 3. Cria o registro do pedido na tabela orders.
     *
     * 4. Cria os registros na tabela order_items relacionando
     *    os itens ao pedido.
     *
     * 5. Atualiza o estoque dos itens reduzindo a quantidade disponível.
     *
     * 6. Retorna o pedido final com os itens associados.
    */
    async createOrder({
        userId,
        name,
        items
    }){
        
        /* Verifica se todos os itens enviados já existem no sistema se não cria os mesmos com base nos dados enviados
        */
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

        // Se o nome do pedido não for fornecido, gera um nome padrão com base no ID do usuário e na data atual
        if(name === undefined){
            name = `Order user_ref : ${userId}, date_ref : ${new Date().toLocaleDateString()}`;
        }

        /* Calcula o preço total do pedido buscando o preço do item registrado no banco e a quantidade solicitada*/
        let total_order_price = 0;
        for(const item of items){
            const itemFilters = {
                name : item.name
            }
            const findedItem = await itemsService.findItems(itemFilters);

            const itemPrice = Number(findedItem[0].price);
            const itemQuantity = Number(item.quantity);

            total_order_price += itemPrice * itemQuantity;
        }

        // Cria o registro do pedido na tabela orders
        const order = await ordersRepository.create({
            user_id : userId,
            name : name,
            total_price : total_order_price
        })

        if(!order || order.length === 0){
            throw new Error('Error creating order');
        }

        // Cria o objeto do pedido final que será retornado ao cliente, incluindo os itens associados
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

            // Cria os registros na tabela order_items relacionando os itens ao pedido
            await orderItemsRepository.create({
                order_id : order.id,
                item_id : findedItem[0].id,
                quantity : item.quantity,
                price : findedItem[0].price
            })

            // Insere os itens no objeto do pedido final que será retornado ao cliente
            finishedOrder.items.push({
                id : findedItem[0].id,
                name : findedItem[0].name,
                description : findedItem[0].description,
                price : findedItem[0].price,
                quantity : item.quantity
            });

            // Atualiza o estoque dos itens reduzindo a quantidade disponível
            await itemsService.updateItem({
                itemId : findedItem[0].id,
                itemData : {
                    quantity_available : findedItem[0].quantity_available - item.quantity
                }
            })
        }
        
        return finishedOrder;
    }

    /*
     * Update Order
     *
     * Fluxo da atualização:
     *
     * 1. Verifica se o pedido existe.
     * 2. Atualiza os dados básicos do pedido (nome ou usuário).
     * 3. Atualiza os itens associados ao pedido.
     * 4. Atualiza o estoque baseado nas novas quantidades.
     * 5. Recalcula o preço total do pedido.
    */

    async updateOrder({
        orderId,
        orderData
    }){
        const existingOrder = await ordersRepository.find({ id : orderId });

        if(existingOrder.length === 0){
            throw new Error("Order not found");
        }

        // Atualiza primeiramente os dados básicos do pedido (nome ou usuário)
        let updatedOrder = await ordersRepository.update({
            id : orderId,
            name : orderData.name,
            user_id : orderData.user_id
        });

        let finishedItems = [];

        if(orderData.items.length > 0){

            for(const item of orderData.items){

                const itemFilters = {
                    id : item.id
                }

                const findedItem = await itemsService.findItems(itemFilters);

                if(findedItem.length === 0){
                    throw new Error(`Item with id ${item.id} not found`);
                }

                // Atualiza os itens associados ao pedido
                const updatedOrderItem = await orderItemsRepository.update({
                    id : item.id,
                    order_id : orderId,
                    item_id : item.id,
                    quantity : item.quantity,
                    price : item.price
                });

                // Atualiza o estoque baseado nas novas quantidades
                await itemsService.updateItem({
                    itemId : findedItem[0].id,
                    itemData : {
                        quantity_available : findedItem[0].quantity_available - updatedOrderItem.quantity
                    }
                })

            }

        }

        // Busca os itens atualizados para recalcular o preço total do pedido
        const updatedOrderItems = await orderItemsRepository.findByOrderId(orderId);

        let total_order_price = 0;

        for(const orderItem of updatedOrderItems){
            // Recalcula o preço total do pedido
            total_order_price += orderItem.price * orderItem.quantity;

            // Insere os itens no objeto do pedido final que será retornado ao cliente
            finishedItems.push({
                id : orderItem.id,
                name : orderItem.name,
                description : orderItem.description,
                price : orderItem.price,
                quantity : orderItem.quantity
            });
        }

        // Atualiza o preço total do pedido
        updatedOrder = await ordersRepository.update({
            id : orderId,
            total_price : total_order_price
        })

        return {
            id : updatedOrder.id,
            user_id : updatedOrder.user_id,
            name : updatedOrder.name,
            total_price : updatedOrder.total_price,
            items : finishedItems
        }
    }

    /*
     * Delete Order
     *
     * Para remover um pedido é necessário primeiro
     * remover os registros da tabela order_items
     * devido ao relacionamento entre as tabelas.
    */
    async deleteOrder({
        orderId
    }){
        const existingOrder = await ordersRepository.find({ id : orderId });

        if(existingOrder.length === 0){
            throw new Error("Order not found");
        }

        // Busca os itens associados ao pedido para remover os registros da tabela order_items
        const orderItems = await orderItemsRepository.findByOrderId(orderId);

        if(orderItems.length > 0){
            for(const orderItem of orderItems){
                const deletedOrderItem = await orderItemsRepository.deleteByOrderId(orderItem.order_id);

                if(!deletedOrderItem){
                    throw new Error(`Error deleting order item with id ${orderItem.id}`);
                }
            }
        }

        // Remove o pedido da tabela orders
        const deletedOrder = await ordersRepository.delete(orderId);

        if(!deletedOrder){
            throw new Error("Error deleting order");
        }

        return true;
    }

    /* 
     * Find all orders 

     * Retorna todos os pedidos registrados no sistema, incluindo os itens associados a cada pedido.
    */
    async findAllOrders(){
        let allOrders = await ordersRepository.findAll();

        if(allOrders.length === 0){
            return allOrders;
        }

        let finishedOrders = [];

        // Para cada pedido encontrado, busca os itens associados e monta o objeto final do pedido com os itens incluídos
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

    /* 
     * Find orders by filters

     * Permite buscar pedidos com base em filtros específicos, como ID do pedido, ID do usuário, nome do pedido ou preço total.
    */
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

        // Para cada pedido encontrado, busca os itens associados e monta o objeto final do pedido com os itens incluídos
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