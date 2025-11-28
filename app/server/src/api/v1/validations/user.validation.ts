import Joi from 'joi';

export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    role: Joi.string().valid('super_admin', 'admin', 'manager', 'user').optional()
});
