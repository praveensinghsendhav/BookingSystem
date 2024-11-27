import { ICountry } from "@dbinterfaces";
import { Model } from "@models/base.model";
import { Knex } from 'knex';

export class CountryModel extends Model<ICountry> {
    private db: Knex;

    constructor(db: Knex) {
        super(db, "countries");
        this.db = db;
    }

}
