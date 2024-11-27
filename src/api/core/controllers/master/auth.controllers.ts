import { Request, Response } from "express";
import Helpers from "@utils/helpers.utils";
import { UserAuthService } from "@services/master";

class AuthController {
    private static instance: AuthController;

    private constructor() { }

    static getInstance(): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    public async register(req: Request, res: Response) {
        try {
            const result = await UserAuthService.register(req);
            res.json(Helpers.responseHandler(200, "User successfully registered", result));
        } catch (error) {
            if (error instanceof Error)
                res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const result = await UserAuthService.login(req);
            // req.session.isLogin = true;
            res.json(Helpers.responseHandler(200, "Welcome back! You're logged in.", result));
        } catch (error) {
            if (error instanceof Error)
                res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }

    public async logout(req: Request, res: Response) {
        try {
            const result = await UserAuthService.logout(req);
            res.json(Helpers.responseHandler(200, "User successfully Logout", result));
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const message = error.message || "Internal server error";
            res.json(Helpers.responseHandler(statusCode, message, undefined, error.message));
        }
    }

    public async changePassword(req: Request, res: Response) {
        try {
            const result = await UserAuthService.changePassword(req);

            res.json(Helpers.responseHandler(200, "Your password has been updated.", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }

    }

    public async refreshAccessToken(req: Request, res: Response) {
        try {
            const result = await UserAuthService.refreshAccessToken(req);
            res.json(Helpers.responseHandler(200, "New Access Token and Refresh Token has been generated.", result));
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const message = error.message || "Internal server error";
            res.json(Helpers.responseHandler(statusCode, message, undefined, error.message));
        }
    }


}

const authController = AuthController.getInstance();

export { authController as AuthController };
