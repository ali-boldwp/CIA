import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(64).required(),
    role: Joi.string().valid('super_admin', 'admin', 'manager', 'user').optional()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
