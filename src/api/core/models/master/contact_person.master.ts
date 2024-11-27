import { IContact_Person } from "@dbinterfaces";
import { Model } from "@models/base.model";
import { Knex } from 'knex';

export class ContactPersonModel extends Model<IContact_Person> {
    private db: Knex;

    constructor(db: Knex) {
        super(db, "contact_person");
        this.db = db;
    }

}
