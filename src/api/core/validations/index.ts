import { Register, Login, ChangePassword } from "./auth.validations";
import { PostRole, UpdateRole } from "./role.validations";
import { PostPermission, UpdatePermission } from "./permission.validations";
import { PostRolePermission, UpdateRolePermission, PostRoleName } from "./rolePermission.validations";
import { TenantSchema } from "./tenant.validations";
export { Register, Login, ChangePassword, PostRole, PostPermission, UpdateRole, UpdatePermission, PostRolePermission, UpdateRolePermission, PostRoleName, TenantSchema }