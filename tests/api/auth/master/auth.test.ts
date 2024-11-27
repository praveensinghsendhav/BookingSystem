// Import necessary modules
import { AuthController } from '../../../../src/api/core/controllers/master/auth.controllers'; // Path to your AuthController
import { UserAuthService } from '../../../../src/api/core/services/master/auth.services'; // Path to your UserAuthService
import { Request, Response } from 'express';

// Mock dependencies
jest.mock('../../../../src/api/core/services/master/auth.services');


// test cases for login
describe('AuthController - login', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                email: 'praveensinghsendhav2002@gmail.com',
                password: 'password123',
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

    it('should return a successful login response', async () => {
        const mockLoginResponse = {
            userId: expect.any(String),
            firstName: 'Praveen',
            lastName: 'Thakur',
            emailId: 'praveensinghsendhav2002@gmail.com',
            profilePic: 'http://example.com/profile1.jpg',
            tokens: {
                accessToken: expect.any(String),
                accessTokenExpiry: expect.any(Number),
                refreshToken: expect.any(String),
                refreshTokenExpiry: expect.any(Number),
            },
        };

        (UserAuthService.login as jest.Mock).mockResolvedValue(mockLoginResponse);

        await AuthController.login(req as Request, res as Response);

        expect(UserAuthService.login).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 200, // Matches the actual response structure
            message: "Welcome back! You're logged in.",
            data: mockLoginResponse,
        });
    });

    it('should return an error response for invalid credentials', async () => {
        const mockError = new Error('Incorrect username or password');
        (UserAuthService.login as jest.Mock).mockRejectedValue(mockError);

        await AuthController.login(req as Request, res as Response);

        expect(UserAuthService.login).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 500, // Error response matches the actual response structure
            error: 'Incorrect username or password',
        });
    });
});

// test cases for register
describe('AuthController - register', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                first_name: "Praveen",
                last_name: "Thakur",
                email: "praveen@gmail.com",
                country_code: "91",
                phone: "1500609886",
                password: "Praveen@123",
                role: "admin",
                status: 1
            },
        };
        jsonMock = jest.fn();
        res = {
            json: jsonMock,
        };
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return a successful register response", async () => {
        const mockRegisterResponse = {
            userId: expect.any(String),
            firstName: 'Praveen',
            lastName: 'Thakur',
            emailId: 'praveen@gmail.com',
            profilePic: expect.any(String),
        };

        (UserAuthService.register as jest.Mock).mockResolvedValue(mockRegisterResponse);

        await AuthController.register(req as Request, res as Response);

        expect(UserAuthService.register).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 200, // Matches the actual response structure
            message: "User successfully registered",
            data: mockRegisterResponse,
        });
    })

    it('should return an error response for invalid credentials', async () => {
        const mockError = new Error(expect.any(String));
        (UserAuthService.register as jest.Mock).mockRejectedValue(mockError);

        await AuthController.register(req as Request, res as Response);

        expect(UserAuthService.register).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 500, // Error response matches the actual response structure
            error: expect.any(String),
        });
    });
})

// test cases for password-change
describe('AuthController - password-change', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                oldPassword: "Pratham@128",
                password: "Praveen@123"
            },
        };
        jsonMock = jest.fn();
        res = {
            json: jsonMock,
        };
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return a successful password-change response", async () => {
        const mockChangePasswordResponse = {
            message: "Password updated successfully"
        };

        (UserAuthService.changePassword as jest.Mock).mockResolvedValue(mockChangePasswordResponse);

        await AuthController.changePassword(req as Request, res as Response);

        expect(UserAuthService.changePassword).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 200, // Matches the actual response structure
            message: "Your password has been updated.",
            data: mockChangePasswordResponse,
        });
    })

    it('should return an error response for invalid credentials', async () => {
        const mockError = new Error(expect.any(String));
        (UserAuthService.changePassword as jest.Mock).mockRejectedValue(mockError);

        await AuthController.changePassword(req as Request, res as Response);

        expect(UserAuthService.changePassword).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 500, // Error response matches the actual response structure
            error: expect.any(String),
        });
    });
})


// test cases for refresh-access-token
describe('AuthController - refresh access token', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let req: Partial<Request | any>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            user: {
                id: 'f18fb4e5-8712-45cc-bcd9-f86970c1af1b',
                email: 'praveensinghsendhav2002@gmail.com',
                role: 'superadmin',
                iat: 1732188994,
                exp: 1734780994
            },
            headers: {
                authorization: 'Bearer some-access-token'
            }
        };
        jsonMock = jest.fn();
        res = {
            json: jsonMock,
        };
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return a successful refresh the access token and return it in the response", async () => {
        const mockRefreshAccessTokenResponse = {
            tokens: {
                accessToken: expect.any(String),
                accessTokenExpiry: expect.any(Number),
                refreshToken: expect.any(String),
                refreshTokenExpiry: expect.any(Number),
            },
        };

        (UserAuthService.refreshAccessToken as jest.Mock).mockResolvedValue(mockRefreshAccessTokenResponse);

        await AuthController.refreshAccessToken(req as Request, res as Response);

        expect(UserAuthService.refreshAccessToken).toHaveBeenCalledWith(req);
        expect(jsonMock).toHaveBeenCalledWith({
            status: 200, // Matches the actual response structure
            message: "New Access Token and Refresh Token has been generated.",
            data: mockRefreshAccessTokenResponse,
        });
    })

    it("should return a 403 with the correct message when token is missing", async () => {
        req.headers.authorization = "";
        const mockError = {
            statusCode: 403,
            message: "Token is required"
        };

        (UserAuthService.refreshAccessToken as jest.Mock).mockRejectedValue(mockError);

        await AuthController.refreshAccessToken(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith({
            status: 403,
            message: "Token is required",
            data: undefined,
            error: "Token is required"
        });
    });
})
describe('AuthController - logout', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let req: Partial<Request | any>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer some-refresh-token',
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

    it('should successfully log out a user and return a 200 response', async () => {
        const mockLogoutResponse = { success: true }; // Mock response from the service
        (UserAuthService.logout as jest.Mock).mockResolvedValue(mockLogoutResponse); // Mock service behavior

        await AuthController.logout(req as Request, res as Response); // Call the controller method

        expect(UserAuthService.logout).toHaveBeenCalledWith(req); // Ensure the service is called correctly
        expect(jsonMock).toHaveBeenCalledWith(
            {
                status: 200,
                message: "User successfully Logout",
                data: mockLogoutResponse, // Matches the response structure in the controller
            }
        );
    });

    it('should return an error if logout fails', async () => {
        const mockError = new Error('Token is invalid'); // Mock error
        (UserAuthService.logout as jest.Mock).mockRejectedValue(mockError); // Mock service behavior to throw error

        await AuthController.logout(req as Request, res as Response); // Call the controller method

        expect(UserAuthService.logout).toHaveBeenCalledWith(req); // Ensure the service is called correctly
        expect(jsonMock).toHaveBeenCalledWith(
            {
                status: 500, // Matches the controller's error handling logic
                message: "Token is invalid", // Controller sets this based on error.message
                data: undefined, // No data in the error case
                error: "Token is invalid", // Error passed in response
            }
        );
    });
});
