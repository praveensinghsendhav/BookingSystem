import { Router } from "@classes";
import { PermissionController } from "@controllers/master";
import { Guard, Validator } from "@middlewares/master";
import { PostPermission, UpdatePermission } from "@validations";
export class PermissionRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        const { checkingUserAuth, authorize } = Guard;
        const { validate } = Validator;
        this.router.use(checkingUserAuth, authorize(["manage_permissions"]));
        this.router.get("/", PermissionController.getAllPermissions);
        this.router.post("/", validate(PostPermission), PermissionController.CreatePermission);
        this.router.get("/:permissionId", PermissionController.getOnePermission);
        this.router.patch("/:permissionId", validate(UpdatePermission), PermissionController.updatePermission);
        this.router.delete("/:permissionId", PermissionController.deletePermission);
    }
}
