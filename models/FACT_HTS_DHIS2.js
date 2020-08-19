var seq = require('../config/database');
var sequelize = seq.sequelize;
var Sequelize = seq.Sequelize;
var moment = require('moment');

var FACT_HTS_DHIS2 = sequelize.define('FACT_HTS_DHIS2', {
	id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
	DHISOrgId: { type: Sequelize.STRING },
	SiteCode: { type: Sequelize.STRING },
	FacilityName: { type: Sequelize.STRING },
	County: { type: Sequelize.STRING },
	SubCounty: { type: Sequelize.STRING },
	Ward: { type: Sequelize.STRING },
	ReportMonth_Year: { type: Sequelize.STRING },
	Tested_Total: { type: Sequelize.INTEGER },
	Positive_Total: { type: Sequelize.INTEGER },
}, {
	timestamps: true,
	freezeTableName: true,
	indexes: [
		{ unique: true, fields: ['id'] },
		{ unique: false, fields: ['DHISOrgId'] },
		{ unique: false, fields: ['SiteCode'] },
		{ unique: false, fields: ['FacilityName'] },
		{ unique: false, fields: ['County'] },
		{ unique: false, fields: ['SubCounty'] },
		{ unique: false, fields: ['Ward'] },
		{ unique: false, fields: ['ReportMonth_Year'] }
	]
});

FACT_HTS_DHIS2.sync();

module.exports = {
	find: function (options) {
		options.order = [['updatedAt', 'DESC']];
		return FACT_HTS_DHIS2.findAndCountAll(options);
	},
	create: function (body) {
		var options = {
			where: { DHISOrgId:body.DHISOrgId, ReportMonth_Year: body.ReportMonth_Year },
			order: [['updatedAt', 'DESC']]
		};
		return FACT_HTS_DHIS2.findOne(options).then(function (data) {
			if(data) {
				body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
				return data.update(body);
			} else {
				return FACT_HTS_DHIS2.create(body);
			}
		});
	},
	update: function (body) {
		if (body.id) {
			return FACT_HTS_DHIS2.findById(body.id).then(function (data) {
				if(data) {
					body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
					return data.update(body);
				} else {
					return this.create(body);
				}
			});
		}
		return this.create(body);
	}
}