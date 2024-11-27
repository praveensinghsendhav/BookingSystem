import { IUser } from '@dbinterfaces';
import UserModel from '@models/master/usermodel.master';
import AuthHelpers from '@utils/authHelpers.utils';
import { Knex } from 'knex';
import Helpers from '@utils/helpers.utils';
import * as bcrypt from 'bcrypt';
import RefreshTokenModel from '../../models/refresh.model';
import { RoleModel } from '@models/master/role.master';
import { IToken } from '@interfaces';

export class AuthFactory extends AuthHelpers {

    private userModel: UserModel;
    private refreshTokenModel: RefreshTokenModel;
    private roleModel: RoleModel;

    constructor(db: Knex) {
        super();
        this.userModel = new UserModel(db);
        this.refreshTokenModel = new RefreshTokenModel(db);
        this.roleModel = new RoleModel(db);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async register(userDetails: IUser, isTenant: boolean) {
        try {
            const model = this.userModel;

            const rolemodel = this.roleModel;

            const existingUser = await model.findByEmail(userDetails.email);
            if (existingUser) {
                throw new Error('User already exists');
            }

            const hashedPassword = await bcrypt.hash(userDetails.password, 10);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [roleId] = await rolemodel.find({ name: userDetails.role } as any);

            if (!roleId) {
                throw new Error("Role You Assigned Not Found");
            }
            const data = {
                ...userDetails,
                password: hashedPassword,
                uuid: this.generateUUID(),
                role: roleId.id
            };

            const createuser = await model.createUser(data);

            if (!createuser) {
                throw new Error("Internal server error, unable to create user");

            }

            return {
                userId: createuser.uuid,
                firstName: createuser.first_name,
                lastName: createuser.last_name,
                emailId: createuser.email,
                profilePic: createuser.profile_url || null,
            };
        } catch (err) {
            console.log(err);
            if (err instanceof Error)
                throw new Error(err.message);
        }

    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async login(userDetails: { email: string; password: string }, isTenant: boolean) {
        try {

            const model = this.userModel;
            const tokenModel = this.refreshTokenModel;
            const roleModel = this.roleModel;

            const existingUser = await model.findByEmail(userDetails.email);

            if (!existingUser) {
                throw new Error("Incorrect username or password. Please try again.!");
            }

            if (existingUser.status === -1) {
                throw new Error("You Are BlackListed. Please Contact with Admin.!");
            }
            // Compare provided password with stored password
            const passMatch = await this.comparePassword(userDetails.password, existingUser.password);
            if (!passMatch) {
                throw new Error("Incorrect username or password. Please try again.!");
            }
            await model.updatebyEmail(userDetails.email, { last_login: Helpers.getCurrentSQLTimestamp() });

            if (!existingUser.role) {
                throw new Error("User Role is not defined");
            }
            const rolename = await roleModel.findById(existingUser.role);
            const accessTokenExpiry = Helpers.calculateTokenExpiry("a");
            const refreshTokenExpiry = Helpers.calculateTokenExpiry("r");
            const payload = { id: existingUser.uuid, email: existingUser.email, role: rolename.name };
            const accessToken = this.generateToken(payload, accessTokenExpiry);
            const refreshToken = this.generateToken(payload, refreshTokenExpiry);

            await tokenModel.insertToken(this.generateUUID(), refreshToken, existingUser.id, Helpers.convertSecondsToDate(refreshTokenExpiry));

            // await client.set("SuperAdminRefreshTokenId", savedRefreshToken.uuid);

            return {
                userId: existingUser.uuid,
                firstName: existingUser.first_name,
                lastName: existingUser.last_name,
                emailId: existingUser.email,
                profilePic: existingUser.profile_url || null,
                tokens: {
                    accessToken: accessToken,
                    accessTokenExpiry,
                    refreshToken: refreshToken,
                    refreshTokenExpiry,
                },
            };

        } catch (err) {
            console.log(err);
            if (err instanceof Error)
                throw new Error(err.message);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async logout(token: string, isTenant: boolean) {
        try {

            const tokenModel = this.refreshTokenModel;

            const tokenDetails = await tokenModel.findOne({ token });
            if (!tokenDetails) {
                throw new Error("Token is invalid");
            }
            await tokenModel.delete(tokenDetails.id);

        } catch (err) {
            console.log(err);
            if (err instanceof Error)
                throw new Error(err.message);
        }
    }

    public async refreshAccessToken(userdata: IToken, isTenant: boolean, token: string) {

        try {
            const model = this.userModel;
            const tokenModel = this.refreshTokenModel;

            const user = await model.findByUUID(userdata.id);

            if (!user) {
                throw new Error("User Not Found please try again");
            }

            // Generate a new access token with the extracted payload
            const accessTokenExpiry = Helpers.calculateTokenExpiry("a");
            const refreshTokenExpiry = Helpers.calculateTokenExpiry("r");

            const payload = { id: userdata.id, email: userdata.email, role: userdata.role };
            const newaccessToken = this.generateToken(payload, accessTokenExpiry);
            const newrefreshToken = this.generateToken(payload, refreshTokenExpiry);

            const getTokenId = await tokenModel.findOne({ token });

            await tokenModel.updatebyUUID(getTokenId.uuid, { token: newrefreshToken, expires: Helpers.convertSecondsToDate(refreshTokenExpiry) });

            return {
                tokens: {
                    accessToken: newaccessToken,
                    accessTokenExpiry,
                    refreshToken: newrefreshToken,
                    refreshTokenExpiry,
                },
            };
        } catch (error) {
            // Throw error if user is not found or if the token is invalid
            throw new Error(`Internal server error: ${error.message}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async changePassword(email: string, passwords: { oldPassword: string; password: string; }, isTenant: boolean) {
        try {

            const model = this.userModel;

            const existingUser = await model.findByEmail(email);

            if (!existingUser) {
                throw new Error("Incorrect username or password. Please try again.!");
            }

            // Compare alds provided password with stored password
            const passMatch = await this.comparePassword(passwords.password, existingUser.password);

            if (passMatch) {
                throw new Error("Your Password is same as your old password, Please use another password.!");
            }

            const oldpassmatch = await this.comparePassword(passwords.oldPassword, existingUser.password);
            if (!oldpassmatch) {
                throw new Error("Old Password is incorrect");
            }

            const hashedPassword = await bcrypt.hash(passwords.password, 10);

            if (oldpassmatch)
                await model.updatebyEmail(email, { password: hashedPassword });

            return { message: "Password updated successfully" };

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async getAllStaffs() {
        try {
            const model = this.userModel;
            const result = await model.find();
            return result;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async getOneStaffs(uuid: string) {
        try {
            const model = this.userModel;
            const result = await model.findByUUID(uuid);
            return result;

        } catch (err) {
            throw new Error(err.message);
        }
    }

}