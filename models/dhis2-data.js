var seq = require('../config/database');
var sequelize = seq.sequelize;
var Sequelize = seq.Sequelize;
var moment = require('moment');

var Dhis2Data = sequelize.define('FACT_CT_DHIS2', {
	id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
	DHISOrgId: { type: Sequelize.STRING },
	SiteCode: { type: Sequelize.STRING },
	FacilityName: { type: Sequelize.STRING },
	County: { type: Sequelize.STRING },
	SubCounty: { type: Sequelize.STRING },
	Ward: { type: Sequelize.STRING },
	ReportMonth_Year: { type: Sequelize.STRING },
	Enrolled_Total: { type: Sequelize.INTEGER },
	StartedART_Total: { type: Sequelize.INTEGER },
	CurrentOnART_Total: { type: Sequelize.INTEGER },
	CTX_Total: { type: Sequelize.INTEGER },
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

Dhis2Data.sync();

module.exports = {
	find: function (options) {
		options.order = [['updatedAt', 'DESC']];
		return Dhis2Data.findAndCountAll(options);
	},
	create: function (body) {
		var options = {
			where: { DHISOrgId:body.DHISOrgId, ReportMonth_Year: body.ReportMonth_Year },
			order: [['updatedAt', 'DESC']]
		};
		return Dhis2Data.findOne(options).then(function (dhis2Data) {
			if(dhis2Data) {
				body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
				return dhis2Data.update(body);
			} else {
				return Dhis2Data.create(body);
			}
		});
	},
	update: function (body) {
		if (body.id) {
			return Dhis2Data.findById(body.id).then(function (dhis2Data) {
				if(dhis2Data) {
					body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
					return dhis2Data.update(body);
				} else {
					return this.create(body);
				}
			});
		}
		return this.create(body);
	}
}