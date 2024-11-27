import { ITenant } from "@dbinterfaces";
import { Model } from "@models/base.model";
import { Knex } from "knex";


export class TenantModel extends Model<ITenant> {
    private db: Knex;

    constructor(db: Knex) {
        super(db, "tenants");
        this.db = db;
    }
    public getDbConnection(): Knex {
        return this.db;
    }

}
