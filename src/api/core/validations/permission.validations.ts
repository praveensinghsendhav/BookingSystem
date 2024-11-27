
import * as Joi from "joi"
const PostPermission: Joi.ObjectSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.base': 'Name must be a string.',
            'string.max': 'Name must not exceed 50 characters.',
            'any.required': 'Name is required.',
        }),

    description: Joi.string()
        .allow(null, '') // Optional, can be null or empty string
        .messages({
            'string.base': 'Description must be a string.',
        }),
})

const UpdatePermission: Joi.ObjectSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.base': 'Name must be a string.',
            'string.max': 'Name must not exceed 50 characters.',
            'any.required': 'Name is required.',
        }),

    description: Joi.string()
        .optional()
        .allow(null, '') // Optional, can be null or empty string
        .messages({
            'string.base': 'Description must be a string.',
        }),
})

export {
    PostPermission, UpdatePermission
}