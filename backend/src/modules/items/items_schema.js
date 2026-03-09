const {z} = require('zod');

const createItemSchema = z.object({
    name : z.string().min(1, 'Name is required'),
    description : z.string().optional(),
    price : z.coerce.number().positive().min(1, 'Price is required'),
    quantity : z.coerce.number().int().positive().min(0, 'Quantity must be a non-negative integer')
})

const updateItemSchema = z.object({
    name : z.string().min(1).optional(),
    description : z.string().optional(),
    price : z.coerce.number().positive().min(1).optional(),
    quantity : z.coerce.number().int().positive().min(0, 'Quantity must be a non-negative integer').optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : 'At least one field must be provided for update'}
)

const findItemSchema = z.object({
    id : z.coerce.number().int().optional(),
    name : z.string().optional(),
    description : z.string().optional(),
    price : z.coerce.number().positive().min(1).optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : 'At least one field must be provided for update'}
)

module.exports = {
    createItemSchema,
    updateItemSchema,
    findItemSchema
}