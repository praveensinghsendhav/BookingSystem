/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "@dbinterfaces";
import { AuthFactory } from "@factories/master";
import AuthHelpers from '@utils/authHelpers.utils';
import { Request } from "express";
class UserAuthService extends AuthHelpers {

    private static instance: UserAuthService;

    private constructor() {
        super();
    }

    static getInstance(): UserAuthService {
        if (!UserAuthService.instance) {
            UserAuthService.instance = new UserAuthService();
        }
        return UserAuthService.instance;
    }


    public async register(req: Request | any) {
        const { first_name, last_name, email, country_code, phone, password, profile_url, status, role }: IUser = req.body;

        const data: IUser = {
            first_name,
            last_name,
            email,
            country_code,
            phone,
            password,
            profile_url,
            status,
            role
        };

        const db = (req as any).knex;
        const isTenant = (req as any).isTenant;
        try {
            const authFactory = new AuthFactory(db);
            return await authFactory.register(data, isTenant);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async login(req: Request) {
        const { email, password } = req.body;
        const db = (req as any).knex;
        const isTenant = (req as any).isTenant;
        try {
            const authFactory = new AuthFactory(db);
            return await authFactory.login({ email, password }, isTenant);

        } catch (error) {
            throw new Error(error.message);
        }

    }

    public async logout(req: Request) {
        const db = (req as any).knex;
        const isTenant = (req as any).isTenant;
        const refreshToken = req.headers.authorization;
        const token = refreshToken.split(' ')[1];
        try {
            const authFactory = new AuthFactory(db);
            return await authFactory.logout(token, isTenant);

        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async refreshAccessToken(req: Request | any) {
        const db = req.knex;
        const isTenant = req.isTenant;
        const refreshToken = req.headers.authorization;
        const token = refreshToken.split(' ')[1];
        try {
            const authFactory = new AuthFactory(db)
            return await authFactory.refreshAccessToken(req.user, isTenant, token);
        } catch (error) {
            throw new Error("Invalid RefreshToken", error);
        }
    }

    public async changePassword(req: Request | any) {
        const { oldPassword, password } = req.body;
        const { email } = req.user;
        const db = (req as any).knex;
        const isTenant = (req as any).isTenant;
        try {
            const authFactory = new AuthFactory(db)
            return await authFactory.changePassword(email, { oldPassword, password }, isTenant);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const userAuthService = UserAuthService.getInstance();

export { userAuthService as UserAuthService }