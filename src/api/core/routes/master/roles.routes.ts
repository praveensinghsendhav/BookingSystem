import { Router } from "@classes";
import { RoleController } from "@controllers/master";
import { Guard, Validator } from "@middlewares/master";
import { PostRole, UpdateRole } from "@validations";
export class RolesRoutes extends Router {
    constructor() {
        super();
    }

    define(): void {
        const { checkingUserAuth, authorize } = Guard;
        const { validate } = Validator
        this.router.use(checkingUserAuth, authorize(["manage_roles"]));
        this.router.get("/", RoleController.getAllRoles);
        this.router.post("/", validate(PostRole), RoleController.CreateRole);
        this.router.get("/:roleId", RoleController.getOneRole);
        this.router.patch("/:roleId", validate(UpdateRole), RoleController.updateRole);
        this.router.delete("/:roleId", RoleController.deleteRole);
    }
}
