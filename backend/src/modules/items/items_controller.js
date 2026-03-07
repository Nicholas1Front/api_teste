const itemsService = require('./items_service');
const {
    createItemSchema,
    updateItemSchema,
    findItemSchema
} = require('./items_schema');

class ItemsController{
    async createItem(req, res){
        try{
            const itemData = createItemSchema.parse(req.body);

            const item = await itemsService.createItem(itemData);

            return res.status(200).json({
                message : 'Item created successfully',
                data : item
            });
        }catch(err){
            return res.status(400).json({
                message : "Error creating item",
                error : err.message
            })
        }
    }

    async updateItem(req, res){
        try{
            const data = updateItemSchema.parse(req.body);

            const item = await itemsService.updateItem({
                itemId : req.params.id,
                itemData : data
            })

            return res.status(200).json({
                message : "Item updated successfully",
                data : item
            });
        }catch(err){
            return res.status(400).json({
                message : "Error updating item",
                error : err.message 
            })
        }
    }

    async findItem(req ,res){
        try{
            const filters = await findItemSchema.parse(req.query);

            const items = await itemsService.findItems(filters);

            return res.status(200).json({
                message : "Items found successfully",
                data : items
            })
        }catch(err){
            return res.status(400).json({
                message : "Error finding item",
                error : err.message
            })
        }
    }

    async findAllItems(req, res){
        try{
            const items = await itemsService.findAllItems();

            return res.status(200).json({
                message : "Items found successfully",
                data : items
            })
        }catch(err){
            return res.status(400).json({
                message : "Error finding items",
                error : err.message
            })
        }
    }

    async deleteItem(req, res){
        try{
            await itemsService.deleteItem(req.params.id);

            return res.status(200).json({
                message : "Item deleted successfully"
            });
        }catch(err){
            return res.status(400).json({
                message : "Error deleting item",
                error : err.message
            })
        }
    }
}

module.exports = new ItemsController();