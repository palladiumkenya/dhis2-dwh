var axios = require("axios");
var conf = require("dotenv").config();
var FACT_HTS_DHIS2 = require("../models/FACT_HTS_DHIS2");
var moment = require("moment");
var utils = require("../config/utils");

module.exports = {

    processPMTCTDhis2Dwh(startDate, endDate) {
        var start = moment(startDate, "YYYY-MM-DD", true);
        var end = moment(endDate, "YYYY-MM-DD", true);
        var periods = utils.getDhis2Periods(start, end);
        periods.forEach(period => this.processPMTCTDhis2DwhForPeriod(period));
    },

    processPMTCTDhis2DwhForPeriod(period) {
        var ou = "dimension=ou:LEVEL-5;";
        var de = "dimension=dx:uSxBUWnagGg;C8xdcRWT9d2;qSgLzXh46n9;ETX9cUWF43c;mQz4DhBSv9V;LQpQQP3KnU1;ssqPT53vnZf;kk8BEq4Jlf7;PXUzSsmeY0P;oZc8MNc0nLZ;nwXS5vxrrr7;hn3aChn4sVx;AfHArvGun12;hHLR1HP8xzI;KYpWTsp2yHv;lJpaBye9B0H;WNFWVHMqPv9;ckPCoAwmWmT;vkOYqEesPAi;PyDKoTxqKB9;UMyB7dSIdz1;wMYMF6VVcCW;MciNE2W7sor;i5jVVTm1vI8;hZrdUVigO54;UdXbP4fFObF;Y0hKWx5oza6;VBCPSPnEnPx;DUr6GIyAR0h;W8kBodAGDBo;HsJtt7Nzn1z;mM9oXTBwkXS;WcO6ZWYvXPB;YzC4XfEm8E6;APBLLBYtVP3;C5b8YcNtR8D;SAva1cicjiX;wc8k1HwRUB6;HAumxpKBaoK;Jn6ATTfXp02;RY1js5pK2Ep;PgYIC96gz70;OMEeGtvqlx1;UIok7l6W4nh;KQDcvUpq0rx;R0CoqawtNCc;DMr8fYCKJzF;uMEWtdvqMj2;SNaQTm9pPNb;xHufJhG2OJx;Sb7py5Bpscw;AyIWn14DRdG;w8Mh4mNrZkF;iWhHBwe5R1H;l2BRlJnfhmJ;DO7Ix0h8vfS;efy1HMhR4NC;JJDVvDJ02cb;HzahP52iTLK";
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