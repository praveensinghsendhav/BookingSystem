import { Request, Response } from "express";
import Helpers from "@utils/helpers.utils";
import { TenantService } from "@services/master";

class TenantController {
    private static instance: TenantController;

    private constructor() { }

    static getInstance(): TenantController {
        if (!TenantController.instance) {
            TenantController.instance = new TenantController();
        }
        return TenantController.instance;
    }


    public async createTenant(req: Request, res: Response) {
        try {
            const result = await TenantService.createTenant(req);
            res.json(Helpers.responseHandler(200, "Tenant Created Successfully", result));
        } catch (error) {
            res.json(Helpers.responseHandler(500, undefined, undefined, error.message));
        }
    }
}

const tenantController = TenantController.getInstance();

export { tenantController as TenantController };
