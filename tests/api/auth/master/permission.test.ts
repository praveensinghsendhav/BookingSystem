import { PermissionController } from '../../../../src/api/core/controllers/master/permission.controllers';
import { PermissionService } from '../../../../src/api/core/services/master/permission.services';
import { Request, Response } from 'express';

jest.mock('../../../../src/api/core/services/master/permission.services');

describe('PermissionController', () => {
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

    describe('getAllPermissions', () => {
        it('should fetch all permissions successfully', async () => {
            const mockPermissions = [
                {
                    id: expect.any(Number),
                    uuid: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                },
            ];
            (PermissionService.getAllPermissions as jest.Mock).mockResolvedValue(mockPermissions);

            await PermissionController.getAllPermissions(req as Request, res as Response);

            expect(PermissionService.getAllPermissions).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "All Permissions are Fetched Successfully",
                data: mockPermissions,
            });
        });

        it('should handle errors gracefully', async () => {
            const mockError = new Error('Database error');
            (PermissionService.getAllPermissions as jest.Mock).mockRejectedValue(mockError);

            await PermissionController.getAllPermissions(req as Request, res as Response);

            expect(PermissionService.getAllPermissions).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });

        it('should handle empty permission list', async () => {
            (PermissionService.getAllPermissions as jest.Mock).mockResolvedValue([]);

            await PermissionController.getAllPermissions(req as Request, res as Response);

            expect(PermissionService.getAllPermissions).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "All Permissions are Fetched Successfully",
                data: [],
            });
        });
    });

    describe('CreatePermission', () => {
        it('should create a new permission successfully', async () => {
            req.body = { name: 'Execute', description: 'Execute Permission' };
            const mockPermission = {
                id: expect.any(Number),
                uuid: expect.any(String),
                name: 'Execute',
                description: 'Execute Permission',
                created_at: expect.any(String),
                updated_at: expect.any(String)
            };
            (PermissionService.CreatePermission as jest.Mock).mockResolvedValue(mockPermission);

            await PermissionController.CreatePermission(req as Request, res as Response);

            expect(PermissionService.CreatePermission).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "Given Permission is Created Successfully",
                data: mockPermission,
            });
        });

        it('should handle duplicate permission error', async () => {
            req.body = { name: 'Read', description: 'Duplicate Read Permission' };
            const mockError = new Error('Permission Already Exist');
            (PermissionService.CreatePermission as jest.Mock).mockRejectedValue(mockError);

            await PermissionController.CreatePermission(req as Request, res as Response);

            expect(PermissionService.CreatePermission).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });
    });

    describe('getOnePermission', () => {
        it('should fetch a single permission successfully', async () => {
            req.params = { permissionId: '1' };
            const mockPermission = {
                id: expect.any(Number),
                uuid: '1',
                name: expect.any(String),
                description: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String)
            };
            (PermissionService.getOnePermission as jest.Mock).mockResolvedValue(mockPermission);

            await PermissionController.getOnePermission(req as Request, res as Response);

            expect(PermissionService.getOnePermission).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "Permission Fetched Successfully",
                data: mockPermission,
            });
        });

        it('should handle permission not found', async () => {
            req.params = { permissionId: '999' };
            const mockError = new Error('Permission not Found');
            (PermissionService.getOnePermission as jest.Mock).mockRejectedValue(mockError);

            await PermissionController.getOnePermission(req as Request, res as Response);

            expect(PermissionService.getOnePermission).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });
    });

    describe('updatePermission', () => {
        it('should update a permission successfully', async () => {
            req.params = { permissionId: '1' };
            req.body = { name: 'Read Updated', description: 'Updated Description' };
            const mockUpdatedPermission = {
                id: expect.any(Number),
                uuid: '1',
                name: 'Read Updated',
                description: 'Updated Description',
                created_at: expect.any(String),
                updated_at: expect.any(String)
            };
            (PermissionService.updatePermission as jest.Mock).mockResolvedValue(mockUpdatedPermission);

            await PermissionController.updatePermission(req as Request, res as Response);

            expect(PermissionService.updatePermission).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "Permission Updated Successfully",
                data: mockUpdatedPermission,
            });
        });

        it('should handle permission not found for update', async () => {
            req.params = { permissionId: '999' };
            const mockError = new Error('Permission not Found');
            (PermissionService.updatePermission as jest.Mock).mockRejectedValue(mockError);

            await PermissionController.updatePermission(req as Request, res as Response);

            expect(PermissionService.updatePermission).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });
    });

    describe('deletePermission', () => {
        it('should delete a permission successfully', async () => {
            req.params = { permissionId: '1' };
            const mockResult = { success: true };
            (PermissionService.deletePermission as jest.Mock).mockResolvedValue(mockResult);

            await PermissionController.deletePermission(req as Request, res as Response);

            expect(PermissionService.deletePermission).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "Permission deleted Successfully",
                data: mockResult,
            });
        });

        it('should handle permission not found for deletion', async () => {
            req.params = { permissionId: '999' };
            const mockError = new Error('Permission not Found or Already Deleted');
            (PermissionService.deletePermission as jest.Mock).mockRejectedValue(mockError);

            await PermissionController.deletePermission(req as Request, res as Response);

            expect(PermissionService.deletePermission).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });
    });
});
