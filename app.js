var express =  require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
var rfs = require('rotating-file-stream')
var conf = require('dotenv').config();
var port = process.env.API_PORT;
var app = express();
var logDirectory = path.join(__dirname, 'logs')
var router = require('./routes');
var moment = require("moment");

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = rfs.createStream('access.log', { interval: '1d', compress: "gzip", path: logDirectory })

app.use(morgan('combined', {stream: accessLogStream}))
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
app.use(function(err, req, res, next) {
	res.status(err.status || 500)
	.json({
		status: 'error',
		message: err.message
	});
});
app.listen(port, function() {
	console.log('Server started on port ' + port);
});

var CronJob = require('cron').CronJob;
var FACT_HTS_DHIS2_Worker = require('./workers/FACT_HTS_DHIS2');
var FACT_CT_DHIS2_Worker = require('./workers/FACT_CT_DHIS2');

var previousMonthCTPullJob = new CronJob('0,30 1 * * *', function() { // everyday at 1am
	var period = moment().subtract(1, "month").format("YYYYMM"); // previous month
    FACT_CT_DHIS2_Worker.processCTDhis2DwhForPeriod(period);
}, null, true, 'Africa/Nairobi');

var previousMonthHTSPullJob = new CronJob('0,30 2 * * *', function() { // everyday at 2am
	var period = moment().subtract(1, "month").format("YYYYMM"); // previous month
    FACT_HTS_DHIS2_Worker.processHTSDhis2DwhForPeriod(period);
}, null, true, 'Africa/Nairobi');

var fullCTPullJob = new CronJob('0 2 20,22 * *', function() { // every month on the 20th at 2am
	var startDate = "2019-10-01";
	var endDate = moment().subtract(2, "month").endOf('month').format("YYYY-MM-DD");
	FACT_CT_DHIS2_Worker.processCTDhis2Dwh(startDate, endDate);
}, null, true, 'Africa/Nairobi');

var fullHTSPullJob = new CronJob('0 3 20,22 * *', function() { // every month on the 20th at 3am
	var startDate = "2019-10-01";
	var endDate = moment().subtract(2, "month").endOf('month').format("YYYY-MM-DD");
	FACT_HTS_DHIS2_Worker.processHTSDhis2Dwh(startDate, endDate);
}, null, true, 'Africa/Nairobi');

previousMonthCTPullJob.start();
previousMonthHTSPullJob.start();
fullCTPullJob.start();
fullHTSPullJob.start();

module.exports = app;