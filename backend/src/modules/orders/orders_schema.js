const {z} = require('zod');

const createrOrderSchema = z.object({
    name : z.string().min(1).optional(),
    items : z.array(
        z.object({
            name : z.string().min(1, 'Name is required'),
            description : z.string().optional(),
            price : z.coerce.number().positive().min(1, 'Price is required'),
            quantity : z.coerce.number().int().min(0, 'Quantity must be a non-negative integer')
        })
    )
})

const updateOrderSchema = z.object({
    user_id : z.coerce.number().int().positive().optional(),
    name : z.string().min(1).optional(),
    items : z.array(
        z.object({
            id : z.coerce.number().int().positive().optional(),
            name : z.string().min(1, 'Name is required'),
            description : z.string().optional(),
            price : z.coerce.number().positive().min(1, 'Price is required'),
            quantity : z.coerce.number().int().min(0, 'Quantity must be a non-negative integer')
        }).optional()
    )
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for update"}
)

const findOrdersSchema = z.object({
    id : z.coerce.number().int().positive().optional(),
    user_id : z.coerce.number().int().positive().optional(),
    name : z.string().min(1).optional(),
    total_price : z.coerce.number().positive().min(1, 'Price must be a positive number').optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for search"}
)

module.exports = {
    createrOrderSchema,
    updateOrderSchema,
    findOrdersSchema
}