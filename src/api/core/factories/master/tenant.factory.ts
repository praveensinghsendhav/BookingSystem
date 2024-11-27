import { TenantModel } from "@models/master/tenant.master";
import { RoleModel } from '@models/master/role.master';
import { CityModel } from "@models/master/city.master";
import { CountryModel } from "@models/master/country.master";
import { StateModel } from "@models/master/state.master";
import { ContactPersonModel } from "@models/master/contact_person.master";
import AuthHelpers from "@utils/authHelpers.utils";
import { createAndMigrate } from "@utils/CreateAndMigrate.utils";
import { DbDefaultConfig } from "@config/knex.config";
import { Knex } from "knex";
import { ITenant } from "@dbinterfaces";

export class TenantFactory extends AuthHelpers {
    private tenantModel: TenantModel;
    private roleModel: RoleModel;
    private cityModel: CityModel;
    private countryModel: CountryModel;
    private stateModel: StateModel;
    private contactPersonModel: ContactPersonModel;

    constructor(db: Knex) {
        super();
        this.tenantModel = new TenantModel(db);
        this.roleModel = new RoleModel(db);
        this.countryModel = new CountryModel(db);
        this.stateModel = new StateModel(db);
        this.cityModel = new CityModel(db);
        this.contactPersonModel = new ContactPersonModel(db);
    }

    public async createTenant(tenantData: ITenant) {
        const tenantModel = this.tenantModel;
        const db = tenantModel.getDbConnection(); // Knex instance for transactions
        const trx = await db.transaction();

        try {
            const {
                name,
                domain,
                logo_url,
                email,
                phone,
                address,
                country_name,
                state_name,
                city_name,
                zip_code,
                registration_number,
                timezone,
                status,
                billing_email,
                metadata,
                contact
            } = tenantData;
            // Check if tenant already exists
            const tenantExist = await tenantModel.findWithConditions({ domain, name }, trx);
            const registeredTenant = await tenantModel.findOne({ registration_number: registration_number }, trx);
            const contactpersonExist = await this.contactPersonModel.findOne({ email: contact.email }, trx);
            if (tenantExist.length > 0) {
                throw new Error(`Tenant "${name}" with domain "${domain}" already exists.`);
            }

            if (registeredTenant) {
                throw new Error(`Tenant with registration number "${registration_number}" already exists.`);
            }

            if (contactpersonExist) {
                throw new Error(`Contact person with email "${contact.email}" already exists.`);
            }

            const contcatpersonExist = await this.contactPersonModel.findWithConditions({ email });
            if (contcatpersonExist.length > 0) {
                throw new Error(`Contact person with email "${email}" already exists.`);
            }
            // Validate country, state, and city
            const countryDetails = await this.countryModel.findOne({ name: country_name }, trx);
            if (!countryDetails) {
                throw new Error(`Country "${country_name}" not found`);
            }

            const stateDetails = await this.stateModel.findOne({ name: state_name, country_id: countryDetails.id }, trx);
            if (!stateDetails) {
                throw new Error(`State "${state_name}" not found`);
            }

            const cityDetails = await this.cityModel.findOne({ name: city_name, state_id: stateDetails.id }, trx);
            if (!cityDetails) {
                throw new Error(`City "${city_name}" not found`);
            }

            // Create tenant
            const [tenantId] = await tenantModel.create({
                uuid: this.generateUUID(),
                name,
                domain,
                logo_url,
                email,
                phone,
                address,
                country_id: countryDetails.id,
                state_id: stateDetails.id,
                city_id: cityDetails.id,
                zip_code,
                registration_number,
                timezone,
                status,
                billing_email,
                metadata,
            }, trx);

            // Create contact person
            await this.contactPersonModel.create({
                uuid: this.generateUUID(),
                firstname: contact.firstname,
                lastname: contact.lastname,
                email: contact.email,
                phone: contact.phone,
                alternative_phone: contact.alternative_phone,
                tenant_id: tenantId,
            }, trx);

            // Prepare staff data
            const preparedStaff = {
                uuid: this.generateUUID(),
                first_name: contact.firstname,
                last_name: contact.lastname,
                email: contact.email,
                country_code: countryDetails.country_code.toString(),
                phone: contact.phone,
                password: await this.hashPassword(`${tenantData.domain}@2015`),
                profile_url: "",
                last_login: null,
                status: 1,
                role: 0, // Superadmin role ID to be fetched after migrations
            };

            // Set database name for tenant
            DbDefaultConfig.database = tenantData.domain;
            // Run database creation and migration
            const { databaseCreated, migrationApplied } = await createAndMigrate(
                DbDefaultConfig,
                preparedStaff,
                process.cwd() + "/src/db/tenant/migrations"
            );

            if (!databaseCreated || !migrationApplied) {
                throw new Error("Failed to complete database creation or migrations.");
            }

            // Commit transaction
            await trx.commit();

            console.info(`Tenant "${name}" created successfully with ID ${tenantId}.`);
        } catch (err) {
            await trx.rollback();
            console.error("Error creating tenant:", err.message);
            throw new Error(err.message || "Failed to create tenant");
        }
    }
}
