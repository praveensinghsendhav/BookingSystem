import { IState } from "@dbinterfaces";
import { Model } from "@models/base.model";
import { Knex } from 'knex';

export class StateModel extends Model<IState> {
    private db: Knex;

    constructor(db: Knex) {
        super(db, "states");
        this.db = db;
    }

}
