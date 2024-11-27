/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITenant } from "@dbinterfaces";
import { TenantFactory } from "@factories/master";
import AuthHelpers from '@utils/authHelpers.utils';
import { Request } from "express";

class TenantService extends AuthHelpers {

    private static instance: TenantService;

    private constructor() {
        super();
    }

    static getInstance(): TenantService {
        if (!TenantService.instance) {
            TenantService.instance = new TenantService();
        }
        return TenantService.instance;
    }

    public async createTenant(req: Request) {
        const db = (req as any).knex;
        const { tenantName, domainName, emailId, phoneNumber,
            TenantAddress, countryName, stateName, cityName, zipCode,
            registrationNumber, timeZone, tenantStatus, billingEmail,
            contactPerson, logoUrl, metaData } = req.body;

        try {
            const tenantData: ITenant = {
                name: tenantName,
                domain: domainName,
                logo_url: logoUrl,
                email: emailId,
                phone: phoneNumber,
                address: TenantAddress,
                country_name: countryName,
                state_name: stateName,
                city_name: cityName,
                zip_code: zipCode,
                registration_number: registrationNumber,
                timezone: timeZone,
                status: tenantStatus,
                billing_email: billingEmail,
                metadata: metaData,
                contact: contactPerson ? {
                    firstname: contactPerson.firstName,
                    lastname: contactPerson.lastName,
                    email: contactPerson.contactEmail,
                    phone: contactPerson.contactPhone,
                    alternative_phone: contactPerson.contactAlternativePhone
                } : undefined
            };

            // Filter out undefined values
            const filteredTenantData: ITenant = Object.fromEntries(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                Object.entries(tenantData).filter(([key, value]) => value !== undefined)
            ) as ITenant;
            // Call the TenantFactory to create the tenant
            const tenantFactory = new TenantFactory(db);
            return await tenantFactory.createTenant(filteredTenantData);

        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const tenantService = TenantService.getInstance();

export { tenantService as TenantService };
