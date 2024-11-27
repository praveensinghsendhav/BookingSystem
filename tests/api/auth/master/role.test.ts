import { RoleController } from '../../../../src/api/core/controllers/master/role.controllers';
import { RolesService } from '../../../../src/api/core/services/master/roles.services';
import { Request, Response } from 'express';

jest.mock('../../../../src/api/core/services/master/roles.services');

describe('RoleController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = { params: {}, body: {} };
        jsonMock = jest.fn();
        res = { json: jsonMock } as Partial<Response>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllRoles', () => {
        it('should fetch all roles successfully', async () => {
            const mockRoles = [
                {
                    id: expect.any(Number),
                    uuid: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                }
            ];
            (RolesService.getAllRoles as jest.Mock).mockResolvedValue(mockRoles);

            await RoleController.getAllRoles(req as Request, res as Response);

            expect(RolesService.getAllRoles).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "All Roles are Fetched Successfully",
                data: mockRoles,
            });
        });

        it('should handle errors gracefully', async () => {
            const mockError = new Error('Database error');
            (RolesService.getAllRoles as jest.Mock).mockRejectedValue(mockError);

            await RoleController.getAllRoles(req as Request, res as Response);

            expect(RolesService.getAllRoles).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });

        it('should handle empty role list', async () => {
            (RolesService.getAllRoles as jest.Mock).mockResolvedValue([]);

            await RoleController.getAllRoles(req as Request, res as Response);

            expect(RolesService.getAllRoles).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "All Roles are Fetched Successfully",
                data: [],
            });
        });
    });

    describe('getOneRole', () => {
        it('should fetch a single role successfully', async () => {
            req.params = { roleId: "1" };
            const mockRole = {
                id: expect.any(Number),
                uuid: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String)
            };
            (RolesService.getOneRole as jest.Mock).mockResolvedValue(mockRole);

            await RoleController.getOneRole(req as Request, res as Response);

            expect(RolesService.getOneRole).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "Role Fetched Successfully",
                data: mockRole,
            });
        });

        it('should handle role not found', async () => {
            req.params = { roleId: '999' };
            const mockError = new Error('Role not Found');
            (RolesService.getOneRole as jest.Mock).mockRejectedValue(mockError);

            await RoleController.getOneRole(req as Request, res as Response);

            expect(RolesService.getOneRole).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });
    });

    describe('CreateRole', () => {
        it('should create a new role successfully', async () => {
            req.body = { name: 'Manager', description: 'Handles Management' };
            const mockRole = {
                id: expect.any(Number),
                uuid: expect.any(String),
                name: 'Manager',
                description: 'Handles Management',
                created_at: expect.any(String),
                updated_at: expect.any(String)
            };
            (RolesService.CreateRole as jest.Mock).mockResolvedValue(mockRole);

            await RoleController.CreateRole(req as Request, res as Response);

            expect(RolesService.CreateRole).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "Given Role is Created Successfully",
                data: mockRole,
            });
        });

        it('should handle duplicate role error', async () => {
            req.body = { name: 'Admin', description: 'Administrator' };
            const mockError = new Error('Role Already Exist');
            (RolesService.CreateRole as jest.Mock).mockRejectedValue(mockError);

            await RoleController.CreateRole(req as Request, res as Response);

            expect(RolesService.CreateRole).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });
    });

    describe('updateRole', () => {
        it('should update a role successfully', async () => {
            req.params = { roleId: '1' };
            req.body = { name: 'Admin Updated', description: 'Updated Description' };
            const mockUpdatedRole = {
                id: expect.any(Number),
                uuid: expect.any(String),
                name: 'Admin Updated',
                description: 'Updated Description',
                created_at: expect.any(String),
                updated_at: expect.any(String)
            };
            (RolesService.updateRole as jest.Mock).mockResolvedValue(mockUpdatedRole);

            await RoleController.updateRole(req as Request, res as Response);

            expect(RolesService.updateRole).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "Role Updated Successfully",
                data: mockUpdatedRole,
            });
        });

        it('should handle role not found for update', async () => {
            req.params = { roleId: '999' };
            const mockError = new Error('Role not Found');
            (RolesService.updateRole as jest.Mock).mockRejectedValue(mockError);

            await RoleController.updateRole(req as Request, res as Response);

            expect(RolesService.updateRole).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });
    });

    describe('deleteRole', () => {
        it('should delete a role successfully', async () => {
            req.params = { roleId: '1' };
            const mockResult = { success: true };
            (RolesService.deleteRole as jest.Mock).mockResolvedValue(mockResult);

            await RoleController.deleteRole(req as Request, res as Response);

            expect(RolesService.deleteRole).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "Role deleted Successfully",
                data: mockResult,
            });
        });

        it('should handle role not found for deletion', async () => {
            req.params = { roleId: '999' };
            const mockError = new Error('Role not Found or Already Deleted');
            (RolesService.deleteRole as jest.Mock).mockRejectedValue(mockError);

            await RoleController.deleteRole(req as Request, res as Response);

            expect(RolesService.deleteRole).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });
    });
});
