import { UserController } from '../../../../src/api/core/controllers/master/user.controllers';
import { UserService } from '../../../../src/api/core/services/master/user.services';
import { Request, Response } from 'express';

jest.mock('../../../../src/api/core/services/master/user.services');

describe('UserController', () => {
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

    describe('getAllStaffs', () => {
        it('should fetch all staffs successfully', async () => {
            const mockStaffs = [{
                id: expect.any(Number),
                uuid: expect.any(String),
                first_name: expect.any(String),
                last_name: expect.any(String),
                email: expect.any(String),
                country_code: expect.any(String),
                phone: expect.any(String),
                password: expect.any(String),
                profile_url: expect.any(String),
                date_register: expect.any(String),
                last_login: expect.any(String),
                status: expect.any(Number),
                role: expect.any(Number),
                created_at: expect.any(String),
                updated_at: expect.any(String)
            }];
            (UserService.getAllStaffs as jest.Mock).mockResolvedValue(mockStaffs);

            await UserController.getAllStaffs(req as Request, res as Response);

            expect(UserService.getAllStaffs).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "All Staffs are Fetched Successfully",
                data: mockStaffs,
            });
        });

        it('should handle errors gracefully', async () => {
            const mockError = new Error('Database error');
            (UserService.getAllStaffs as jest.Mock).mockRejectedValue(mockError);

            await UserController.getAllStaffs(req as Request, res as Response);

            expect(UserService.getAllStaffs).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });

        it('should handle empty staff list', async () => {
            (UserService.getAllStaffs as jest.Mock).mockResolvedValue([]);

            await UserController.getAllStaffs(req as Request, res as Response);

            expect(UserService.getAllStaffs).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "All Staffs are Fetched Successfully",
                data: [],
            });
        });
    });

    describe('getOneStaffs', () => {
        it('should fetch a single staff successfully', async () => {
            req.params = { userId: '123' };
            const mockStaff = {
                id: expect.any(Number),
                uuid: expect.any(String),
                first_name: expect.any(String),
                last_name: expect.any(String),
                email: expect.any(String),
                country_code: expect.any(String),
                phone: expect.any(String),
                password: expect.any(String),
                profile_url: expect.any(String),
                date_register: expect.any(String),
                last_login: expect.any(String),
                status: expect.any(Number),
                role: expect.any(Number),
                created_at: expect.any(String),
                updated_at: expect.any(String)
            };
            (UserService.getOneStaffs as jest.Mock).mockResolvedValue(mockStaff);

            await UserController.getOneStaffs(req as Request, res as Response);

            expect(UserService.getOneStaffs).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "Staff Fetched Successfully",
                data: mockStaff,
            });
        });

        it('should handle staff not found', async () => {
            req.params = { userId: '123' };
            const mockError = new Error('Staff Not Found');
            (UserService.getOneStaffs as jest.Mock).mockRejectedValue(mockError);

            await UserController.getOneStaffs(req as Request, res as Response);

            expect(UserService.getOneStaffs).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });

        it('should handle invalid userId in request parameters', async () => {
            req.params = { userId: '' };
            const mockError = new Error('Invalid User ID');
            (UserService.getOneStaffs as jest.Mock).mockRejectedValue(mockError);

            await UserController.getOneStaffs(req as Request, res as Response);

            expect(UserService.getOneStaffs).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });
    });

    describe('updateStaffs', () => {
        it('should update staff successfully', async () => {
            req.params = { userId: '123' };
            req.body = { email: 'john.doe@example.com', role: 'Admin' };
            const mockUpdatedStaff = expect.any(Number);
            (UserService.updateStaffs as jest.Mock).mockResolvedValue(mockUpdatedStaff);

            await UserController.updateStaffs(req as Request, res as Response);

            expect(UserService.updateStaffs).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 200,
                message: "Staff Updated Successfully",
                data: mockUpdatedStaff,
            });
        });

        it('should handle staff not found for update', async () => {
            req.params = { userId: '123' };
            const mockError = new Error('Staff Not Found');
            (UserService.updateStaffs as jest.Mock).mockRejectedValue(mockError);

            await UserController.updateStaffs(req as Request, res as Response);

            expect(UserService.updateStaffs).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });

        it('should handle missing or invalid request body', async () => {
            req.params = { userId: '123' };
            req.body = { email: '' }; // Invalid body
            const mockError = new Error('Invalid Request Body');
            (UserService.updateStaffs as jest.Mock).mockRejectedValue(mockError);

            await UserController.updateStaffs(req as Request, res as Response);

            expect(UserService.updateStaffs).toHaveBeenCalledWith(req);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 500,
                error: mockError.message,
            });
        });
    });
});
