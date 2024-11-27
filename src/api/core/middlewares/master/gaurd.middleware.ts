import { IUser } from "@dbinterfaces";
import { NextFunction, Request, Response } from "express";
import Helpers from '@utils/helpers.utils';
import * as jwt from 'jsonwebtoken';
import { PermissionModel } from "@models/master/permission.master";
import { RoleModel } from '@models/master/role.master';

interface AuthenticatedRequest extends Request {
    user?: { id: string; email: string; role: string } | jwt.JwtPayload;
}

class Guard {
    private static instance: Guard;

    private constructor() { }

    static get(): Guard {
        if (!Guard.instance) {
            Guard.instance = new Guard();
        }
        return Guard.instance;
    }


    async checkingUserAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ message: 'Authorization token missing or invalid' });
                return; // End the response if there's an error
            }

            const token = authHeader.split(' ')[1];

            if (!token) {
                res.status(403).json(
                    Helpers.responseHandler(403, "You have been Logged Out, SignIn First", undefined, 'Token is required')
                );
                return;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IUser;
            req.user = decoded; // Attach the user to the request object
            next(); // Call next() to proceed to the next middleware/handler
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    }



    authorize(requiredPermissions: string[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return async (req: Request | any, res: Response, next: NextFunction) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const db = (req as any).knex;
            try {
                const user = req.user;
                if (!user) {
                    throw new Error("You are not authorized to perform this action");
                }

                // Check if the user is a superadmin
                if (user.role === "superadmin") {
                    return next(); // Bypass permission check for superadmin
                }

                // Get role ID for the user's role
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const [roleId] = await new RoleModel(db).find({ name: user.role } as any);
                // Fetch user's permissions based on their role
                const userPermissions = await new PermissionModel(db).getPermissionsForRole(roleId.id);

                // Check if the user has all required permissions
                const hasPermissions = requiredPermissions.every((perm) => userPermissions.includes(perm));

                if (!hasPermissions) {
                    throw new Error("You are not authorized to perform this action");
                }
                // Proceed if authorized
                next();
            } catch (err) {
                next(err);
            }
        };
    }

}

// Singleton pattern for Guard instance
const guard = Guard.get();
export { guard as Guard };
