const itemsRepository = require('./items_repository');

class ItemsService{
    async createItem(itemData){
        const existingItem = await itemsRepository.find({ name : itemData.name});

        if(existingItem.length > 0){
            throw new Error('Item with the same name already exists');
        }

        const item = await itemsRepository.create({
            name : itemData.name,
            description : itemData.description,
            price : itemData.price,
            quantity_available : itemData.quantity
        });

        return item;
    }

    async updateItem({
        itemId,
        itemData
    }){
        const existingItem = await itemsRepository.find({ id : itemId });

        if(existingItem.length === 0){
            throw new Error('Item not found');
        }

        const item = await itemsRepository.update({
            id : itemId,
            itemData : itemData
        });

        return item;
    }

    async deleteItem(id){
        const existingItem = await itemsRepository.find({ id });

        if(existingItem.length === 0){
            throw new Error('Item not found');
        }

        await itemsRepository.delete(id);

        return true;
    }

    async findItems(filters){
        const items = await itemsRepository.find({
            id : filters.id,
            name : filters.name,
            description : filters.description,
            price : filters.price
        });

        return items;
    }

    async findAllItems(){
        const items = await itemsRepository.findAll();

        return items;
    }
}

module.exports = new ItemsService();