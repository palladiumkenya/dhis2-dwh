const FACT_HTS_DHIS2 = require('../models/FACT_HTS_DHIS2');
const FACT_HTS_DHIS2_Worker = require('../workers/FACT_HTS_DHIS2');

module.exports = {
	index(req, res) {
		var options = {};
		FACT_HTS_DHIS2.find(options).then(function (data) {
			res.status(200).json({
				"status": "success",
				"meta": {
					"total": data.count
				},
				"fact_hts_dhis2": data.rows
			});
		}).catch(function (error) {
			res.status(500).json(error.message);
		});
	},
	reprocess(req, res) {
		if (req.query.start_date && req.query.end_date) {
			FACT_HTS_DHIS2_Worker.processHTSDhis2Dwh(req.query.start_date, req.query.end_date);
			res.status(200).json({
				"status": "success"
			});
		} else {
			res.status(500).json("Missing start_date or end_date");
		}
	}
};