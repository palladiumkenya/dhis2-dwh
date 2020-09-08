var express =  require('express');
var router = express.Router();
var Status_Controller = require('./controllers/status');
var FACT_CT_DHIS2_Controller = require('./controllers/FACT_CT_DHIS2');
var FACT_HTS_DHIS2_Controller = require('./controllers/FACT_HTS_DHIS2');

router.all('*', checkApiKey);

router.get('/', function(req, res) { res.status(200).json({ status:'OK', message:'DHIS2 to Data Warehouse API' }); });

router.get('/status', Status_Controller.index);

router.get('/hts', FACT_HTS_DHIS2_Controller.index);
router.get('/hts/reprocess', FACT_HTS_DHIS2_Controller.reprocess);

router.get('/ct', FACT_CT_DHIS2_Controller.index);
router.get('/ct/reprocess', FACT_CT_DHIS2_Controller.reprocess);

function checkApiKey(req, res, next) {
	if(req.path == '/' || req.query.api_key == process.env.API_KEY || req.body.api_key == process.env.API_KEY) {
		return next();
  	} else {
  		res.status(550).json({
			"status": "error",
			"message": "permission denied. no api_key"
		});
  	}
}

module.exports = router;