import { Router } from "@classes";
import { TenantSchema } from "@validations";
import { Guard, Validator } from "@middlewares/master";
import { TenantController } from "@controllers/master";
export class TenantsRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        const { checkingUserAuth, authorize } = Guard;
        this.router.use(checkingUserAuth, authorize(["manage_tenants"]));
        this.router.post("/", Validator.validate(TenantSchema), TenantController.createTenant)
    }
}
