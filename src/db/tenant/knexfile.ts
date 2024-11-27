// Import necessary modules and configurations
import 'module-alias/register';

import { defaultConfiguration } from '@config/knex.config';

const config = {
    ...defaultConfiguration,
    migrations: {
        directory: "./migrations",
    },
    seeds: {
        directory: "./seeds",
    }
}

export default config;
