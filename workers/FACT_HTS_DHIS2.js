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
        var de =
			"dimension=dx:NOga2tabGrd;dlldM4hP2Wk;OePJt8CcZ0d;lj9QYJqS7bN;gMICOUtzqRb;XiRbc0DSMOH;YXJf27jfkvS;pkShOkgNQt2;JiuqbydCIcy;gTkVw97FnQK;atSQz5O7e2A;du5RMT3aecB;D9YwtS6RhQ1;wu0ITFRjUzF;kLXGWRLzCAw;xMNhnyu7vm1;F9OR49Lc1aR;oCFXmpol7D8;J4vNm7YEkdj;cBTa1jVzT8f;";
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
                    data.Tested_1_9 = typeof row[11] !== "undefined" && row[11].trim() !== "" ? parseInt(row[11]) : null;
                    data.Tested_10_14_M = typeof row[12] !== "undefined" && row[12].trim() !== "" ? parseInt(row[12]) : null;
                    data.Tested_10_14_F = typeof row[13] !== "undefined" && row[13].trim() !== "" ? parseInt(row[13]) : null;
                    data.Tested_15_19_M = typeof row[14] !== "undefined" && row[14].trim() !== "" ? parseInt(row[14]) : null;
                    data.Tested_15_19_F = typeof row[15] !== "undefined" && row[15].trim() !== "" ? parseInt(row[15]) : null;
                    data.Tested_20_24_M = typeof row[16] !== "undefined" && row[16].trim() !== "" ? parseInt(row[16]) : null;
                    data.Tested_20_24_F = typeof row[17] !== "undefined" && row[17].trim() !== "" ? parseInt(row[17]) : null;
                    data.Tested_25_Plus_M = typeof row[18] !== "undefined" && row[18].trim() !== "" ? parseInt(row[18]) : null;
                    data.Tested_25_Plus_F = typeof row[19] !== "undefined" && row[19].trim() !== "" ? parseInt(row[19]) : null;
                    data.Positive_1_9 = typeof row[20] !== "undefined" && row[20].trim() !== "" ? parseInt(row[20]) : null;
                    data.Positive_10_14_M = typeof row[21] !== "undefined" && row[21].trim() !== "" ? parseInt(row[21]) : null;
                    data.Positive_10_14_F = typeof row[22] !== "undefined" && row[22].trim() !== "" ? parseInt(row[22]) : null;
                    data.Positive_15_19_M = typeof row[23] !== "undefined" && row[23].trim() !== "" ? parseInt(row[23]) : null;
                    data.Positive_15_19_F = typeof row[24] !== "undefined" && row[24].trim() !== "" ? parseInt(row[24]) : null;
                    data.Positive_20_24_M = typeof row[25] !== "undefined" && row[25].trim() !== "" ? parseInt(row[25]) : null;
                    data.Positive_20_24_F = typeof row[26] !== "undefined" && row[26].trim() !== "" ? parseInt(row[26]) : null;
                    data.Positive_25_Plus_M = typeof row[27] !== "undefined" && row[27].trim() !== "" ? parseInt(row[27]) : null;
                    data.Positive_25_Plus_F = typeof row[28] !== "undefined" && row[28].trim() !== "" ? parseInt(row[28]) : null;

                    FACT_HTS_DHIS2.create(data);
                });
            }
        }).catch(function (error) {
            console.log("ProcessHTSDhis2Dwh for " + period + " failed at " + new Date() + " Reason: " + error.message);
        });
    }
}