import { Permission } from "./Permission.intefaces";
export type TransformedRoleData = {
    role_id: string;
    role_name: string;
    all_permissions: Permission[];
};