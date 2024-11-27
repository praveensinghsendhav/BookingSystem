// Import necessary modules
import { RolePermissionController } from '../../../../src/api/core/controllers/master/rolepermission.controller';
import { RolePermissionService } from '../../../../src/api/core/services/master/rolePermission.services';
import { Request, Response } from 'express';

// Mock dependencies
jest.mock('../../../../src/api/core/services/master/rolePermission.services');

// Test cases for getAllRolePermissions
describe('RolePermissionController - getAllRolePermissions', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {};
        jsonMock = jest.fn();
        res = {
            json: jsonMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all role permissions successfully', async () => {
        const mockResponse = [
            {
                role_id: expect.any(String),
                role_name: expect.any(String),
                all_permissions: [
                    {
                        permission_name: expect.any(String),
                        permission_uuid: expect.any(String),
                        role_permission_uuid: expect.any(String)
                    }
                ]
            },
        ];

        (RolePermissionService.getAllRolePermissions as jest.Mock).mockResolvedValue(mockResponse);

        await RolePermissionController.getAllRolePermissions(req as Request, res as Response);

        expect(RolePermissionService.getAllRolePermissions).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 200,
            message: 'All roles and their Permissions are Fetched Successfully',
            data: mockResponse,
        });
    });

    it('should return an error response if fetching fails', async () => {
        const mockError = new Error('Database error');
        (RolePermissionService.getAllRolePermissions as jest.Mock).mockRejectedValue(mockError);

        await RolePermissionController.getAllRolePermissions(req as Request, res as Response);

        expect(RolePermissionService.getAllRolePermissions).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 500,
            error: 'Database error',
        });
    });
});

// Test cases for setRolePermissions
describe('RolePermissionController - setRolePermissions', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                role_name: 'admin',
                permission_names: ['read', 'write'],
            },
        };
        jsonMock = jest.fn();
        res = {
            json: jsonMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set role permissions successfully', async () => {
        const mockResponse = { message: 'Role admin has been assigned with the following permissions (read, write)' };

        (RolePermissionService.setRolePermissions as jest.Mock).mockResolvedValue(mockResponse);

        await RolePermissionController.setRolePermissions(req as Request, res as Response);

        expect(RolePermissionService.setRolePermissions).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 200,
            message: ' role and their Permissions are assigned Successfully',
            data: mockResponse,
        });
    });

    it('should return an error response if setting permissions fails', async () => {
        const mockError = new Error(expect.any(String));
        (RolePermissionService.setRolePermissions as jest.Mock).mockRejectedValue(mockError);

        await RolePermissionController.setRolePermissions(req as Request, res as Response);

        expect(RolePermissionService.setRolePermissions).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 500,
            error: expect.any(String),
        });
    });
});

// Test cases for getRolePermissionsById
describe('RolePermissionController - getRolePermissionsById', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            params: { rolePermissionId: '123' },
        };
        jsonMock = jest.fn();
        res = {
            json: jsonMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return role permissions by ID successfully', async () => {
        const mockResponse = {
            id: expect.any(Number),
            uuid: expect.any(String),
            role_name: expect.any(String),
            permission_names: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String)
        };

        (RolePermissionService.getRolePermissionsById as jest.Mock).mockResolvedValue(mockResponse);

        await RolePermissionController.getRolePermissionsById(req as Request, res as Response);

        expect(RolePermissionService.getRolePermissionsById).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 200,
            message: 'Role and their Permission are Fetched Successfully',
            data: mockResponse,
        });
    });

    it('should return an error response if fetching by ID fails', async () => {
        const mockError = new Error('Role permission not found');
        (RolePermissionService.getRolePermissionsById as jest.Mock).mockRejectedValue(mockError);

        await RolePermissionController.getRolePermissionsById(req as Request, res as Response);

        expect(RolePermissionService.getRolePermissionsById).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 500,
            error: 'Role permission not found',
        });
    });
});

// Test cases for updateRolePermissions
describe('RolePermissionController - updateRolePermissions', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            params: { rolePermissionId: '123' },
            body: { role_name: 'admin', permission_names: ['read', 'write'] },
        };
        jsonMock = jest.fn();
        res = {
            json: jsonMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update role permissions successfully', async () => {
        const mockResponse = expect.any(Number);

        (RolePermissionService.updateRolePermissions as jest.Mock).mockResolvedValue(mockResponse);

        await RolePermissionController.updateRolePermissions(req as Request, res as Response);

        expect(RolePermissionService.updateRolePermissions).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 200,
            message: 'Role and their Permission are Updated Successfully',
            data: mockResponse,
        });
    });

    it('should return an error response if updating permissions fails', async () => {
        const mockError = new Error('Failed to update role permissions');
        (RolePermissionService.updateRolePermissions as jest.Mock).mockRejectedValue(mockError);

        await RolePermissionController.updateRolePermissions(req as Request, res as Response);

        expect(RolePermissionService.updateRolePermissions).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 500,
            error: 'Failed to update role permissions',
        });
    });
});

// Test cases for deleteRolePermissions
describe('RolePermissionController - deleteRolePermissions', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            params: { rolePermissionId: '123' },
        };
        jsonMock = jest.fn();
        res = {
            json: jsonMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete role permissions successfully', async () => {
        const mockResponse = expect.any(Number);

        (RolePermissionService.deleteRolePermissions as jest.Mock).mockResolvedValue(mockResponse);

        await RolePermissionController.deleteRolePermissions(req as Request, res as Response);

        expect(RolePermissionService.deleteRolePermissions).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 200,
            message: 'Role and their Permission are Deleted Successfully',
            data: mockResponse,
        });
    });

    it('should return an error response if deleting permissions fails', async () => {
        const mockError = new Error('Role permission deletion failed');
        (RolePermissionService.deleteRolePermissions as jest.Mock).mockRejectedValue(mockError);

        await RolePermissionController.deleteRolePermissions(req as Request, res as Response);

        expect(RolePermissionService.deleteRolePermissions).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 500,
            error: 'Role permission deletion failed',
        });
    });
});

// Test cases for getPermissionsByRole
describe('RolePermissionController - getPermissionsByRole', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            body: { role_name: 'admin' },
        };
        jsonMock = jest.fn();
        res = {
            json: jsonMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return permissions by role successfully', async () => {
        const mockResponse = [
            {
                role_name: "admin",
                permissions: expect.any(String),
            }
        ];

        (RolePermissionService.getPermissionsByRole as jest.Mock).mockResolvedValue(mockResponse);

        await RolePermissionController.getPermissionsByRole(req as Request, res as Response);

        expect(RolePermissionService.getPermissionsByRole).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 200,
            message: 'Permissions for role admin fetched successfully',
            data: mockResponse,
        });
    });

    it('should return an error response if fetching permissions fails', async () => {
        const mockError = new Error('Permissions fetch failed');
        (RolePermissionService.getPermissionsByRole as jest.Mock).mockRejectedValue(mockError);

        await RolePermissionController.getPermissionsByRole(req as Request, res as Response);

        expect(RolePermissionService.getPermissionsByRole).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 500,
            error: 'Permissions fetch failed',
        });
    });
});
