const env = process.env;

//configs for the connection to the datbase
const dbConfig = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
};

const sessionDbConfig = {
    host: env.SESSION_DB_HOST,
    user: env.SESSION_DB_USER,
    password: env.SESSION_DB_PASSWORD,
    database: env.SESSION_DB_NAME
}

module.exports = [dbConfig, sessionDbConfig];