import { ICities } from "@dbinterfaces";
import { Model } from "@models/base.model";
import { Knex } from 'knex';

export class CityModel extends Model<ICities> {
    private db: Knex;

    constructor(db: Knex) {
        super(db, "cities");
        this.db = db;
    }

}
