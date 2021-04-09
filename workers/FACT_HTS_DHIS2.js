var axios = require("axios");
var conf = require("dotenv").config();
var FACT_HTS_DHIS2 = require("../models/FACT_HTS_DHIS2");
var moment = require("moment");
var utils = require("../config/utils");

module.exports = {

    processHTSDhis2Dwh(startDate, endDate) {
        var start = moment(startDate, "YYYY-MM-DD", true);
        var end = moment(endDate, "YYYY-MM-DD", true);
        var periods = utils.getDhis2Periods(start, end);
        periods.forEach(period => this.processHTSDhis2DwhForPeriod(period));
    },

    processHTSDhis2DwhForPeriod(period) {
        var ou = "dimension=ou:LEVEL-5;";
        var de = "dimension=dx:NOga2tabGrd;dlldM4hP2Wk;";
        var pe = "dimension=pe:" + period + ";";
        var query = "/analytics?" + ou + "&" + de + "&" + pe + "&displayProperty=NAME&showHierarchy=true&tableLayout=true&columns=dx;pe&rows=ou&hideEmptyRows=true&paging=false";
        var config = {
            url: query,
            method: "get",
            timeout: 30 * 60 * 1000, // 30 min
            baseURL: process.env.DHIS2_API_BASE_URL,
            headers: { "Content-Type": "application/json" },
            auth: { username: process.env.DHIS2_USERNAME, password: process.env.DHIS2_PASSWORD }
        }
        axios(config).then(function (response) {
            if (response.data && response.data.rows) {
                response.data.rows.forEach(row => {
                    var data = {};
                    data.DHISOrgId = (typeof row[5] !== "undefined" && row[5].trim() !== "" ? row[5] : null);
                    data.SiteCode = (typeof row[7] !== "undefined" && row[7].trim() !== "" ? row[7] : null);
                    data.FacilityName = (typeof row[6] !== "undefined" && row[6].trim() !== "" ? row[6] : null);
                    data.County = (typeof row[1] !== "undefined" && row[1].trim() !== "" ? row[1].replace(" County", "") : null);
                    data.SubCounty = (typeof row[2] !== "undefined" && row[2].trim() !== "" ? row[2].replace(" Sub County", "") : null);
                    data.Ward = (typeof row[3] !== "undefined" && row[3].trim() !== "" ? row[3].replace(" Ward", "") : null);
                    data.ReportMonth_Year = period;
                    data.Tested_Total = (typeof row[9] !== "undefined" && row[9].trim() !== "" ? parseInt(row[9]) : null);
                    data.Positive_Total = (typeof row[10] !== "undefined" && row[10].trim() !== "" ? parseInt(row[10]) : null);
                    FACT_HTS_DHIS2.create(data);
                });
            }
        }).catch(function (error) {
            console.log("ProcessHTSDhis2Dwh for " + period + " failed at " + new Date() + " Reason: " + error.message);
        });
    }
}