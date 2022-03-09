const FACT_CT_DHIS2 = require('../models/FACT_CT_DHIS2');
const FACT_HTS_DHIS2 = require('../models/FACT_HTS_DHIS2');
const FACT_PMTCT_DHIS2 = require("../models/FACT_CT_DHIS2");

module.exports = {
	index(req, res) {
        var options = {};
        Promise.all([
            FACT_HTS_DHIS2.find(options),
            FACT_CT_DHIS2.find(options),
            FACT_PMTCT_DHIS2.find(options),
        ]).then(function ([hts, ct, pmtct]) {
			res.status(200).json({
				"status": "success",
				"ct": ct.count,
				"hts": hts.count,
				"pmtct": pmtct.count
			});
		}).catch(function (error) {
			res.status(500).json(error.message);
		});
	}
};