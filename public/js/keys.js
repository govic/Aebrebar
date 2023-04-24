module.exports = {

    database: {
        connectionLimit: process.env.RDS_CONN_LIMIT || 10,
        host: process.env.RDS_HOSTNAME || 'localhost',
        port: process.env.RDS_PORT || 3306,
        user: process.env.RDS_USERNAME || 'root',
        password: process.env.RDS_PASSWORD || '',
        database: process.env.RDS_DB_NAME || 'arbim'
    }

};