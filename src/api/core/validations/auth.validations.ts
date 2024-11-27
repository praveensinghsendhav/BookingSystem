import { IUser } from '@dbinterfaces';
import * as Joi from 'joi';

const Register: Joi.ObjectSchema<IUser> = Joi.object({
    first_name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.min': 'First name must be at least 3 characters long.',
            'string.max': 'First name must not exceed 50 characters.',
            'string.pattern.base': 'First name must only contain alphabetic characters and spaces.',
            'any.required': 'First name is required.',
        }),

    last_name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
            'string.min': 'Last name must be at least 3 characters long.',
            'string.max': 'Last name must not exceed 50 characters.',
            'string.pattern.base': 'Last name must only contain alphabetic characters and spaces.',
            'any.required': 'Last name is required.',
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .lowercase()
        .required()
        .messages({
            'string.email': 'Email must be a valid email address.',
            'any.required': 'Email is required.',
        }),

    country_code: Joi.string()
        .trim()
        .pattern(/^\d{1,3}$/)
        .required()
        .messages({
            'string.pattern.base': 'Country code must be between 1 and 3 digits.',
            'any.required': 'Country code is required.',
        }),

    phone: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            'string.pattern.base': 'Phone number must be exactly 10 digits.',
            'any.required': 'Phone number is required.',
        }),

    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': `Password must be at least 8 characters long, 
                                    contain at least one uppercase letter, 
                                    one lowercase letter, 
                                    one number, and one special character.`,
            'any.required': 'Password is required.',
        }),

    profile_url: Joi.string()
        .uri()
        .optional()
        .messages({
            'string.uri': 'Profile URL must be a valid URL.',
        }),

    role: Joi.string()
        .required()
        .messages({
            'any.only': 'Role must be either "admin" or "user".',
            'any.required': 'Role is required.',
        }),

    status: Joi.number()
        .integer()
        .optional()
        .messages({
            'number.base': 'Status must be a number.',
            'number.integer': 'Status must be an integer.',
        }),

}).options({ abortEarly: false });

const Login: Joi.ObjectSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .lowercase()
        .required()
        .messages({
            'string.email': 'Email must be a valid email address.',
            'any.required': 'Email is required.',
        }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required.',
    })
});

const ChangePassword: Joi.ObjectSchema = Joi.object({
    oldPassword: Joi.string().required().messages({
        'any.required': 'OldPassword is required.',
    }),
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': `Password must be at least 8 characters long, 
                                    contain at least one uppercase letter, 
                                    one lowercase letter, 
                                    one number, and one special character.`,
            'any.required': 'Password is required.',
        }),
});


export { Register, Login, ChangePassword };
