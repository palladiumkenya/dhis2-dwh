const Sequelize = require('sequelize');
const options = {
	host: process.env.DATABASE_HOST,
	dialect: process.env.DATABASE_DIALECT,
	logging: false
};
if (options.dialect === 'mssql') {
	options['dialectOptions'] = { options: { encrypt: true } };
}
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, options);
module.exports = { sequelize:sequelize, Sequelize:Sequelize };
