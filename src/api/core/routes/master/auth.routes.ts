import { Router } from "@classes";
import { AuthController } from "@controllers/master";
import { Guard, Validator } from "@middlewares/master";
import { ChangePassword, Login, Register } from '@validations';
export class UserAuthRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        const { checkingUserAuth, authorize } = Guard;
        const { sanitizeMiddleware, validate } = Validator;
        this.router.post("/register", checkingUserAuth, sanitizeMiddleware, validate(Register), authorize(["manage_users"]), AuthController.register);
        this.router.post("/login", sanitizeMiddleware, validate(Login), AuthController.login);
        this.router.post("/logout", checkingUserAuth, AuthController.logout);
        this.router.post("/change-password", checkingUserAuth, sanitizeMiddleware, Validator.validate(ChangePassword), authorize(["manage_users"]), AuthController.changePassword);
        this.router.post("/refresh-access-token", checkingUserAuth, sanitizeMiddleware, AuthController.refreshAccessToken);
    }
}
