var seq = require('../config/database');
var sequelize = seq.sequelize;
var Sequelize = seq.Sequelize;

var Dhis2Data = sequelize.define('dhis2_data', {
	id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
	organisation_unit_id: { type: Sequelize.STRING },
	organisation_unit_code: { type: Sequelize.STRING },
	organisation_unit_level_1: { type: Sequelize.STRING },
	organisation_unit_level_2: { type: Sequelize.STRING },
	organisation_unit_level_3: { type: Sequelize.STRING },
	organisation_unit_level_4: { type: Sequelize.STRING },
	period: { type: Sequelize.STRING },
	enrolled: { type: Sequelize.STRING },
	start_art: { type: Sequelize.STRING },
	on_art: { type: Sequelize.STRING },
	on_ctx: { type: Sequelize.STRING },
	created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
}, {
	timestamps: false,
	indexes: [
		{ unique: true, fields: ['id'] },
		{ unique: false, fields: ['organisation_unit_id'] },
		{ unique: false, fields: ['organisation_unit_code'] },
		{ unique: false, fields: ['organisation_unit_level_1'] },
		{ unique: false, fields: ['organisation_unit_level_2'] },
		{ unique: false, fields: ['organisation_unit_level_3'] },
		{ unique: false, fields: ['organisation_unit_level_4'] },
		{ unique: false, fields: ['period'] },
	    { unique: false, fields: ['created_at'] }
	]
});

Dhis2Data.sync();

module.exports = {
	find: function (options) {
		options.order = [['created_at', 'DESC']];
		return Dhis2Data.findAndCountAll(options);
	}
}