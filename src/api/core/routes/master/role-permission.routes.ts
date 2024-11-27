import { Router } from "@classes";
import { RolePermissionController } from '@controllers/master';
import { Guard, Validator } from "@middlewares/master";
import { PostRoleName, PostRolePermission, UpdateRolePermission } from "@validations";
export class RolesPermissionRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        const { checkingUserAuth, authorize } = Guard;
        const { validate } = Validator;
        this.router.use(checkingUserAuth, authorize(["manage_permissions", "manage_roles"]));
        this.router.get("/", RolePermissionController.getAllRolePermissions);
        this.router.post("/", validate(PostRolePermission), RolePermissionController.setRolePermissions);
        this.router.get("/id/:rolePermissionId", RolePermissionController.getRolePermissionsById);
        this.router.patch("/id/:rolePermissionId", validate(UpdateRolePermission), RolePermissionController.updateRolePermissions);
        this.router.delete("/id/:rolePermissionId", RolePermissionController.deleteRolePermissions);
        this.router.get("/role", validate(PostRoleName), RolePermissionController.getPermissionsByRole);
    }
}             
