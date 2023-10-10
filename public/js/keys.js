module.exports = {

    database: {
        connectionLimit: 10,
        host: process.env.RDS_HOSTNAME || 'awseb-e-t35a8ggqpj-stack-awsebrdsdatabase-svvfnqsspfdw.ck39wztsivta.sa-east-1.rds.amazonaws.com',
        port: process.env.RDS_PORT || 3306,
        user: process.env.RDS_USERNAME || 'admin',
        password: process.env.RDS_PASSWORD || '1G6fnpxc7ZGXXeU5w2Gc',
        database: 'arbim'
    }

};





/** 
module.exports = {

    database: {
        connectionLimit: 10,
        host: process.env.RDS_HOSTNAME || 'localhost',
        port: process.env.RDS_PORT || 3306,
        user: process.env.RDS_USERNAME || 'root',
        password: process.env.RDS_PASSWORD || '',
        database: 'arbim'
    }

};**/
/*
module.exports = {

    database: {
        connectionLimit: 10,
        host: process.env.RDS_HOSTNAME || 'awseb-e-r4iniuesfs-stack-awsebrdsdatabase-jnjxlxycxoje.ck39wztsivta.sa-east-1.rds.amazonaws.com',
        port: process.env.RDS_PORT || 3306,
        user: process.env.RDS_USERNAME || 'admin',
        password: process.env.RDS_PASSWORD || '!4KXs8m6Rgz!v!a',
        database: 'arbim'
    }

};
*/