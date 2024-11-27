import { Knex } from "knex";
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Debugging the directory path
console.log('__dirname:', __dirname);

// Define path to your data.json file
const dataPath = path.join(__dirname, '..', '..', 'db', 'assets', 'data.json');

// Debugging the final path
console.log('Data path:', dataPath);

// Read the JSON data
const countryData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

export async function seed(knex: Knex): Promise<void> {
    // Insert countries data
    for (const country of countryData) {
        // Check if country already exists in the database
        const existingCountry = await knex('countries')
            .where('country_code', parseInt(country.phone_code))
            .first(); // Get the first match (if any)

        let countryId: number;

        if (existingCountry) {
            // If country exists, use the existing ID
            countryId = existingCountry.id;
            console.log(`Country ${country.name} already exists, skipping insert.`);
        } else {
            // Insert country and get the country ID
            const [insertedCountry] = await knex('countries').insert({
                country_code: parseInt(country.phone_code), // Use numeric code as country code
                name: country.name,
                uuid: uuidv4()
            });

            // For MySQL, retrieve the last inserted ID for the country
            if (!insertedCountry) {
                const result = await knex.raw('SELECT LAST_INSERT_ID() AS countryId');
                countryId = result[0].countryId; // Extract countryId from the result
            } else {
                countryId = insertedCountry; // MySQL automatically gives the ID from insert
            }

            console.log('Inserted country with ID:', countryId);
        }

        // Insert states data
        for (const state of country.states) {
            // Check if the state already exists in the database
            const existingState = await knex('states')
                .where('country_id', countryId)
                .andWhere('name', state.name)
                .first();

            let stateId: number;

            if (existingState) {
                // If state exists, use the existing ID
                stateId = existingState.id;
                console.log(`State ${state.name} already exists in country ${country.name}, skipping insert.`);
            } else {
                // Insert state and get the state ID
                const [insertedState] = await knex('states').insert({
                    name: state.name,
                    country_id: countryId,
                    uuid: uuidv4(), // Provide UUID value for the state
                });

                // For MySQL, retrieve the last inserted ID for the state
                if (!insertedState) {
                    const result = await knex.raw('SELECT LAST_INSERT_ID() AS stateId');
                    stateId = result[0].stateId; // Extract stateId from the result
                } else {
                    stateId = insertedState; // MySQL automatically gives the ID from insert
                }

                console.log('Inserted state with ID:', stateId);
            }

            // Insert cities data
            for (const city of state.cities) {
                // Check if the city already exists in the given state (name + state_id combination)
                const existingCity = await knex('cities')
                    .where('state_id', stateId)
                    .andWhere('name', city.name)
                    .first();

                if (existingCity) {
                    // If the city already exists, skip the insert
                    console.log(`City ${city.name} already exists in state ${state.name}, skipping insert.`);
                } else {
                    // Insert city with uuid
                    await knex('cities').insert({
                        name: city.name,
                        state_id: stateId,
                        uuid: uuidv4(), // Provide UUID for the city
                    });
                    console.log(`Inserted city ${city.name} with UUID.`);
                }
            }
        }
    }
};
