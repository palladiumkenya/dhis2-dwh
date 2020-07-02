var express =  require('express');
var router = express.Router();
var dhis2DataController = require('./controllers/dhis2-data-controller');

router.all('*', checkApiKey);

router.get('/', function(req, res) { res.status(200).json({ status:'OK', message:'DHIS2 to Data Warehouse API' }); });
router.get('/status', dhis2DataController.status);
router.get('/dhis2-data', dhis2DataController.index);
router.get('/reprocess', dhis2DataController.reprocess);


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