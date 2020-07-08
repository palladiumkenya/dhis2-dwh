var axios = require("axios");
var conf = require("dotenv").config();
var moment = require("moment");
var DHIS2Data = require("../models/dhis2-data");

module.exports = {

    processDhis2Dwh(startDate, endDate) {
        var start = moment(startDate, "YYYY-MM-DD", true);
        var end = moment(endDate, "YYYY-MM-DD", true);
        var periods = this.getDhis2Periods(start, end);
        periods.forEach(period => this.processDhis2DwhForPeriod(period));
    },

    processDhis2DwhSchedule() {
        var period = moment().subtract(1, "month").format("YYYYMM");
        this.processDhis2DwhForPeriod(period);
    },

    processDhis2DwhForPeriod(period) {
        console.log("ProcessDhis2Dwh for " + period + " started at " + new Date());
        var ou = "dimension=ou:LEVEL-5;";
        var de = "dimension=dx:JljuWsCDpma;sEtNuNusKTT;PUrg2dmCjGI;QrHtUO7UsaM;";
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
                    data.Enrolled_Total = (typeof row[9] !== "undefined" && row[9].trim() !== "" ? parseInt(row[9]) : null);
                    data.StartedART_Total = (typeof row[10] !== "undefined" && row[10].trim() !== "" ? parseInt(row[10]) : null);
                    data.CurrentOnART_Total = (typeof row[11] !== "undefined" && row[11].trim() !== "" ? parseInt(row[11]) : null);
                    data.CTX_Total = (typeof row[12] !== "undefined" && row[12].trim() !== "" ? parseInt(row[12]) : null);
                    DHIS2Data.create(data);
                });
            }
            console.log("ProcessDhis2Dwh for " + period + " completed at " + new Date());
        }).catch(function (error) {
            console.log("ProcessDhis2Dwh for " + period + " failed at " + new Date() + " Reason: " + error.message);
        });
    },

    getDhis2Periods(startDate, endDate) {
        var periods = [];
        var startPeriod = moment(startDate);
        var endPeriod = moment(endDate);

        if (startPeriod.isAfter(endPeriod)) {
            startPeriod = moment(endDate).startOf('month');
            endPeriod = moment(startDate).endOf('month');
        } else {
            startPeriod = moment(startDate).startOf('month');
            endPeriod = moment(endDate).endOf('month');
        }

        diff = Math.ceil(endPeriod.diff(startPeriod, 'months', true));

        for (var i = 0; i < diff; i++)
        {
            var d = startPeriod.clone().add(i, 'months');
            periods.push(d.format("YYYYMM"));
        }
            
        return periods;
    }
}