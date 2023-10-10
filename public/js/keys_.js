module.exports = {

    database: {
        connectionLimit: 10,
        host: process.env.RDS_HOSTNAME || 'localhost',
        port: process.env.RDS_PORT || 3306,
        user: process.env.RDS_USERNAME || 'root',
        password: process.env.RDS_PASSWORD || '',
        database: 'arbim'
    }

};