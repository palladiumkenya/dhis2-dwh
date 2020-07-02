var axios = require("axios");
var conf = require('dotenv').config();
var moment = require('moment');
var DHIS2Data = require('../models/dhis2-data');

module.exports = {
    processDhis2Dwh() {
        console.log("ProcessDhis2Dwh started at " + new Date());
        // var period = moment().format("YYYYMM");
        var period = '202005';
        var ou = "dimension=ou:LEVEL-5;";
        var de = "dimension=dx:JljuWsCDpma;sEtNuNusKTT;PUrg2dmCjGI;QrHtUO7UsaM;";
        var pe = "dimension=pe:" + period + ";";
        var query = "/analytics?" + ou + "&" + de + "&" + pe + "&displayProperty=NAME&showHierarchy=true&tableLayout=true&columns=dx;pe&rows=ou&hideEmptyRows=true&paging=false";
        var config = {
            url: query,
            method: "get",
            timeout: 10 * 60 * 1000, // 10 min
            baseURL: process.env.DHIS2_API_BASE_URL,
            headers: { 'Content-Type': 'application/json' },
            auth: { username: process.env.DHIS2_USERNAME, password: process.env.DHIS2_PASSWORD }
        }
        axios(config).then(function (response) {
            if (response.data && response.data.rows) {
                response.data.rows.forEach(row => {
                    var data = {};
                    data.DHISOrgId = (typeof row[5] !== 'undefined' ? row[5] : '');
                    data.SiteCode = (typeof row[7] !== 'undefined' ? row[7] : '');
                    data.FacilityName = (typeof row[6] !== 'undefined' ? row[6] : '');
                    data.County = (typeof row[1] !== 'undefined' ? row[1].replace(" County", "") : '');
                    data.SubCounty = (typeof row[2] !== 'undefined' ? row[2].replace(" Sub County", "") : '');
                    data.Ward = (typeof row[3] !== 'undefined' ? row[3].replace(" Ward", "") : '');
                    data.ReportMonth_Year = period;
                    data.Enrolled_Total = (typeof row[9] !== 'undefined' ? parseInt(row[9]) : '');
                    data.StartedART_Total = (typeof row[10] !== 'undefined' ? parseInt(row[10]) : '');
                    data.CurrentOnART_Total = (typeof row[11] !== 'undefined' ? parseInt(row[11]) : '');
                    data.CTX_Total = (typeof row[12] !== 'undefined' ? parseInt(row[12]) : '');
                    DHIS2Data.create(data);
                });
            }
            console.log("ProcessDhis2Dwh completed at " + new Date());
        }).catch(function (error) {
            console.log(error.message);
        });
    }
}