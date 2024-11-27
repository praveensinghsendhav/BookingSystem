import { NextFunction, Request, Response } from "express";
import * as Joi from 'joi';

class Validator {
    private static instance: Validator;

    private constructor() { }

    static get(): Validator {
        if (!Validator.instance) {
            Validator.instance = new Validator();
        }
        return Validator.instance;
    }

    sanitizeMiddleware(req: Request, res: Response, next: NextFunction) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sanitizeInput = (input: any) => {
            if (typeof input === 'string') {
                return input.replace(/<\/?[^>]+(>|$)/g, "");
            } else if (typeof input === 'object' && input !== null) {
                Object.keys(input).forEach(key => {
                    input[key] = sanitizeInput(input[key]);
                });
            }
            return input;
        };

        req.body = sanitizeInput(req.body);
        req.query = sanitizeInput(req.query);
        req.params = sanitizeInput(req.params);

        next();
    }

    formatValidationErrors(details: Joi.ValidationErrorItem[]) {
        return details.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            type: err.type,
        }));
    }

    validate = (schema: Joi.Schema, options?: Joi.ValidationOptions) => {
        const defaultOptions: Joi.ValidationOptions = {
            presence: 'optional',
            stripUnknown: false,
            allowUnknown: false,
            abortEarly: false,
        };

        const validationOptions = { ...defaultOptions, ...options };

        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            if (!schema) {
                res.status(400).json({ message: 'Invalid schema for validation' });
                return;
            }

            try {
                const validatedData = await schema.validateAsync(req.body, validationOptions);
                req.body = validatedData;
                next();
            } catch (error) {
                if (error instanceof Joi.ValidationError) {
                    const validationErrors = this.formatValidationErrors(error.details);

                    if (process.env.NODE_ENV === 'development') {
                        console.error('Validation Error:', validationErrors);
                    }

                    res.status(400).json({
                        message: 'Validation Error',
                        errors: validationErrors,
                    });
                    return;
                }

                next(error);
            }
        };
    };
}

// Singleton pattern for Validator instance
const validator = Validator.get();
export { validator as Validator };
