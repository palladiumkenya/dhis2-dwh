const DHIS2Data = require('../models/dhis2-data');
const dhis2AnalyticsWorker = require('../workers/dhis2-analytics');

module.exports = {
	index(req, res) {
		var options = {};
		DHIS2Data.find(options).then(function (dhis2Data) {
			res.status(200).json({
				"status": "success",
				"dhis2_data": dhis2Data.rows,
				"meta": {
					"total": dhis2Data.count
				}
			});
		}).catch(function (error) {
			res.status(500).json(error.message);
		});
	},
	status(req, res) {
		var options = {};
		DHIS2Data.find(options).then(function (dhis2Data) {
			res.status(200).json({
				"status": "success",
				"records": dhis2Data.count,
			});
		}).catch(function (error) {
			res.status(500).json(error.message);
		});
	},
	reprocess(req, res) {
		dhis2AnalyticsWorker.processDhis2Dwh();
		res.status(200).json({
			"status": "success"
		});
	}
};