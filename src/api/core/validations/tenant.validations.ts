import * as Joi from "joi";

// Reusable schema for contact information
const ContactSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.max': 'First name must not exceed 100 characters.',
            'any.required': 'First name is required.',
        }),
    lastName: Joi.string()
        .trim()
        .max(100)
        .allow(null)
        .optional()
        .messages({
            'string.max': 'Last name must not exceed 100 characters.',
        }),
    contactEmail: Joi.string()
        .email({ tlds: { allow: false } })
        .lowercase()
        .max(150)
        .required()
        .messages({
            'string.email': 'Contact email must be a valid email address.',
            'string.max': 'Contact email must not exceed 150 characters.',
            'any.required': 'Contact email is required.',
        }),
    contactPhone: Joi.string()
        .pattern(/^\d{10,20}$/)
        .required()
        .messages({
            'string.pattern.base': 'Contact phone must be between 10 and 20 digits.',
            'any.required': 'Contact phone is required.',
        }),
    contactAlternativePhone: Joi.string()
        .pattern(/^\d{10,20}$/)
        .allow(null)
        .optional()
        .messages({
            'string.pattern.base': 'Alternative phone must be between 10 and 20 digits.',
        }),
});

// Main schema
const TenantSchema: Joi.ObjectSchema = Joi.object({

    tenantName: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z0-9\s\-._]+$/)
        .max(100)
        .required()
        .messages({
            'string.pattern.base': 'Name contains invalid characters.',
            'string.max': 'Name must not exceed 100 characters.',
            'any.required': 'Name is required.',
        }),

    domainName: Joi.string()
        .trim()
        .pattern(/^[a-z0-9.-]+$/)
        .max(100)
        .allow(null)
        .optional()
        .messages({
            'string.pattern.base': 'Domain must be a valid domain format.',
            'string.max': 'Domain must not exceed 100 characters.',
        }),

    logoUrl: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .trim()
        .allow(null)
        .optional()
        .messages({
            'string.uri': 'Logo URL must be a valid URL.',
        }),

    emailId: Joi.string()
        .trim()
        .email({ tlds: { allow: false } })
        .lowercase()
        .max(150)
        .required()
        .messages({
            'string.email': 'Email must be a valid email address.',
            'string.max': 'Email must not exceed 150 characters.',
            'any.required': 'Email is required.',
        }),

    phoneNumber: Joi.string()
        .pattern(/^\d{10,20}$/)
        .allow(null)
        .optional()
        .messages({
            'string.pattern.base': 'Phone must be between 10 and 20 digits.',
        }),

    TenantAddress: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z0-9\s\-.,]+$/)
        .max(250)
        .required()
        .messages({
            'string.pattern.base': 'Address contains invalid characters.',
            'string.max': 'Address must not exceed 250 characters.',
            'any.required': 'Address is required.',
        }),

    countryName: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.max': 'Country name must not exceed 100 characters.',
            'any.required': 'Country name is required.',
        }),

    stateName: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.max': 'State name must not exceed 100 characters.',
            'any.required': 'State name is required.',
        }),

    cityName: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.max': 'City name must not exceed 100 characters.',
            'any.required': 'City name is required.',
        }),

    zipCode: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z0-9\- ]{3,15}$/)
        .required()
        .messages({
            'string.pattern.base': 'Zip code must be between 3 and 15 alphanumeric characters.',
            'any.required': 'Zip code is required.',
        }),

    registrationNumber: Joi.string()
        .trim()
        .max(54)
        .required()
        .messages({
            'string.max': 'Registration number must not exceed 54 characters.',
            'any.required': 'Registration number is required.',
        }),

    timeZone: Joi.string()
        .trim()
        .max(50)
        .default('UTC')
        .required()
        .messages({
            'string.max': 'Timezone must not exceed 50 characters.',
            'any.required': 'Timezone is required.',
        }),

    tenantStatus: Joi.number()
        .integer()
        .valid(1, 0, -1)
        .default(1)
        .optional()
        .messages({
            'number.base': 'Status must be a number.',
            'number.integer': 'Status must be an integer.',
            'any.only': 'Status must be one of 1 (Active), 0 (Inactive), or -1 (Blacklisted).',
            'any.required': 'Status is required.',
        }),

    billingEmail: Joi.string()
        .trim()
        .email({ tlds: { allow: false } })
        .lowercase()
        .allow(null)
        .optional()
        .messages({
            'string.email': 'Billing email must be a valid email address.',
        }),

    metaData: Joi.object()
        .pattern(/^[a-zA-Z0-9._-]+$/, Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean(), Joi.object()))
        .allow(null)
        .optional()
        .messages({
            'object.pattern': 'Metadata must contain valid key-value pairs.',
        }),

    contactPerson: ContactSchema.required(),
});

export { TenantSchema };
