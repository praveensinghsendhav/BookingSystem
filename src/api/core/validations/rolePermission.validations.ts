import * as Joi from "joi";

const PostRolePermission: Joi.ObjectSchema = Joi.object({
    role_name: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.base': 'Role Name must be a string.',
            'string.max': 'Role Name must not exceed 50 characters.',
            'any.required': 'Role Name is required.',
        }),
    permission_names: Joi.array()
        .items(
            Joi.string().max(50).messages({
                'string.base': 'Each Permission Name must be a string.',
                'string.max': 'Each Permission Name must not exceed 50 characters.',
            })
        )
        .min(1) // Ensure the array has at least one item
        .required()
        .messages({
            'array.base': 'Permission Names must be an array.',
            'array.min': 'Permission Names must contain at least one permission.',
            'any.required': 'Permission Names are required.',
        }),
});

const UpdateRolePermission: Joi.ObjectSchema = Joi.object({
    role_name: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.base': 'Role Name must be a string.',
            'string.max': 'Role Name must not exceed 50 characters.',
            'any.required': 'Role Name is required.',
        }),
    permission_names: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.base': 'Permission Name must be a string.',
            'string.max': 'Permission Name must not exceed 50 characters.',
            'any.required': 'Permission Name is required.',
        }),
});

const PostRoleName: Joi.ObjectSchema = Joi.object({
    role_name: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.base': 'Role Name must be a string.',
            'string.max': 'Role Name must not exceed 50 characters.',
            'any.required': 'Role Name is required.',
        }),
});


export { PostRolePermission, UpdateRolePermission, PostRoleName }