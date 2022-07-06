var axios = require("axios");
var conf = require("dotenv").config();
var FACT_PMTCT_DHIS2 = require("../models/FACT_PMTCT_DHIS2");
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
                    data["1stAncVisits"] = (typeof row[9] !== "undefined" && row[9].trim() !== "" ?  parseInt(row[9]) : null);
                    data.deliveryFromHivPosMothers = (typeof row[10] !== "undefined" && row[10].trim() !== "" ?  parseInt(row[10]) : null);
                    data.knownPosAt1stAnc = (typeof row[11] !== "undefined" && row[11].trim() !== "" ?  parseInt(row[11]) : null);
                    data.intialTestAtAnc = (typeof row[12] !== "undefined" && row[12].trim() !== "" ?  parseInt(row[12]) : null)
                    data["initialTestAtL&D"] = (typeof row[13] !== "undefined" && row[13].trim() !== "" ?  parseInt(row[13]) : null)
                    data["initialTestAtPnc<=6wks"] = (typeof row[14] !== "undefined" && row[14].trim() !== "" ?  parseInt(row[14]) : null)
                    data.knownHivStatusTotal = (typeof row[15] !== "undefined" && row[15].trim() !== "" ?  parseInt(row[15]) : null)
                    data["retestingPnc<=6wks"] = (typeof row[16] !== "undefined" && row[16].trim() !== "" ?  parseInt(row[16]) : null)
                    data["testedPnc>6wksTo6mnts"] = (typeof row[17] !== "undefined" && row[17].trim() !== "" ?  parseInt(row[17]) : null)
                    data.knowPosAt1stAnc = (typeof row[18] !== "undefined" && row[18].trim() !== "" ?  parseInt(row[18]) : null)
                    data.posResultsAnc = (typeof row[19] !== "undefined" && row[19].trim() !== "" ? parseInt(row[19]) : null)
                    data["posResultsL&D"] = (typeof row[20] !== "undefined" && row[20].trim() !== "" ? parseInt(row[20]) : null)
                    data["posResultsPnc<=6wks"] = (typeof row[21] !== "undefined" && row[21].trim() !== "" ? parseInt(row[21]) : null)
                    data["posPnc>6wksTo6mnts"] = (typeof row[22] !== "undefined" && row[22].trim() !== "" ? parseInt(row[22]) : null)
                    data.totalPos = (typeof row[23] !== "undefined" && row[23].trim() !== "" ? parseInt(row[23]) : null)
                    data.onHAARTat1stAnc = (typeof row[24] !== "undefined" && row[24].trim() !== "" ? parseInt(row[24]) : null)
                    data.startHAARTanc = (typeof row[25] !== "undefined" && row[25].trim() !== "" ? parseInt(row[25]) : null)
                    data["startHAARTL&D"] = (typeof row[26] !== "undefined" && row[26].trim() !== "" ? parseInt(row[26]) : null)
                    data["startHAARTpnc<=6wks"] = (typeof row[27] !== "undefined" && row[27].trim() !== "" ? parseInt(row[27]) : null)
                    data.onMaternalHAARTtotal = (typeof row[28] !== "undefined" && row[28].trim() !== "" ? parseInt(row[28]) : null)
                    data["startHAARTPnc>6wksto6mnts"] = (typeof row[29] !== "undefined" && row[29].trim() !== "" ? parseInt(row[29]) : null)
                    data.onMaternalHAART12mnts = (typeof row[30] !== "undefined" && row[30].trim() !== "" ? parseInt(row[30]) : null)
                    data.newCohort12mths = (typeof row[31] !== "undefined" && row[31].trim() !== "" ? parseInt(row[31]) : null)
                    data.syphilisScreened1stanc = (typeof row[32] !== "undefined" && row[32].trim() !== "" ? parseInt(row[32]) : null)
                    data.syphilisScreenedPos = (typeof row[33] !== "undefined" && row[33].trim() !== "" ? parseInt(row[33]) : null)
                    data.syphilisTreated = (typeof row[34] !== "undefined" && row[34].trim() !== "" ? parseInt(row[34]) : null)
                    data.HIVposMordernFP6wks = (typeof row[35] !== "undefined" && row[35].trim() !== "" ? parseInt(row[35]) : null)
                    data.HIVposPncVisits6wks = (typeof row[36] !== "undefined" && row[36].trim() !== "" ? parseInt(row[36]) : null)
                    data.knownStatus1stContact = (typeof row[37] !== "undefined" && row[37].trim() !== "" ? parseInt(row[37]) : null)
                    data.initialTestANCMale = (typeof row[38] !== "undefined" && row[38].trim() !== "" ? parseInt(row[38]) : null)
                    data["initialTestL&DMale"] = (typeof row[39] !== "undefined" && row[39].trim() !== "" ? parseInt(row[39]) : null)
                    data.initialTestPncMale = (typeof row[40] !== "undefined" && row[40].trim() !== "" ? parseInt(row[40]) : null)
                    data.totalKnownStatusMale = (typeof row[41] !== "undefined" && row[41].trim() !== "" ? parseInt(row[41]) : null)
                    data["1stAncKPAdolescencts"] = (typeof row[42] !== "undefined" && row[42].trim() !== "" ? parseInt(row[42]) : null)
                    data.PosResultAdolescents = (typeof row[43] !== "undefined" && row[43].trim() !== "" ? parseInt(row[43]) : null)
                    data.StartedHAARTAdolescentsTotal = (typeof row[44] !== "undefined" && row[44].trim() !== "" ? parseInt(row[44]) : null)
                    data.knownExposureAtPenta1 = (typeof row[45] !== "undefined" && row[45].trim() !== "" ? parseInt(row[45]) : null)
                    data.totalGivenPenta1 = (typeof row[46] !== "undefined" && row[46].trim() !== "" ? parseInt(row[46]) : null)
                    data.infantARVProphylANC = (typeof row[47] !== "undefined" && row[47].trim() !== "" ? parseInt(row[47]) : null)
                    data["infantARVProphylL&D"] = (typeof row[48] !== "undefined" && row[48].trim() !== "" ? parseInt(row[48]) : null)
                    data["infantARVProphyl<8wksPNC"] = (typeof row[49] !== "undefined" && row[49].trim() !== "" ? parseInt(row[49]) : null)
                    data.totalARVProphyl = (typeof row[50] !== "undefined" && row[50].trim() !== "" ? parseInt(row[50]) : null)
                    data["HEICtxDdsStart<2mnts"] = (typeof row[51] !== "undefined" && row[51].trim() !== "" ? parseInt(row[51]) : null)
                    data["initialPCR<8wks"] = (typeof row[52] !== "undefined" && row[52].trim() !== "" ? parseInt(row[52]) : null)
                    data["initialPCR>8wksTo12mnts"] = (typeof row[53] !== "undefined" && row[53].trim() !== "" ? parseInt(row[53]) : null)
                    data["initialPCRtest<12mntsTotal"] = (typeof row[54] !== "undefined" && row[54].trim() !== "" ? parseInt(row[54]) : null)
                    data.infected24mnts = (typeof row[55] !== "undefined" && row[55].trim() !== "" ? parseInt(row[55]) : null)
                    data.uninfected24mnts = (typeof row[56] !== "undefined" && row[56].trim() !== "" ? parseInt(row[56]) : null)
                    data.unknownOutcome = (typeof row[57] !== "undefined" && row[57].trim() !== "" ? parseInt(row[57]) : null)
                    data.netCohortHEI24mnts = (typeof row[58] !== "undefined" && row[58].trim() !== "" ? parseInt(row[58]) : null)
                    data.motherBabyPairs24mnts = (typeof row[59] !== "undefined" && row[59].trim() !== "" ? parseInt(row[59]) : null)
                    data.pairNetCohort24mnts = (typeof row[60] !== "undefined" && row[60].trim() !== "" ? parseInt(row[60]) : null)
                    data.EBFat6mnts = (typeof row[61] !== "undefined" && row[61].trim() !== "" ? parseInt(row[61]) : null)
                    data.ERFat6mnts = (typeof row[62] !== "undefined" && row[62].trim() !== "" ? parseInt(row[62]) : null)
                    data.MFat6mnts = (typeof row[63] !== "undefined" && row[63].trim() !== "" ? parseInt(row[63]) : null)
                    data.BFat12mnts = (typeof row[64] !== "undefined" && row[64].trim() !== "" ? parseInt(row[64]) : null)
                    data.notBFat12mnts = (typeof row[65] !== "undefined" && row[65].trim() !== "" ? parseInt(row[65]) : null)
                    data.BFat18mnts = (typeof row[66] !== "undefined" && row[66].trim() !== "" ? parseInt(row[66]) : null)
                    data.notBFat18mnts = (typeof row[67] !== "undefined" && row[67].trim() !== "" ? parseInt(row[67]) : null);

                    FACT_PMTCT_DHIS2.create(data);
                });
            }
        }).catch(function (error) {
            console.log("ProcessPMTCTDhis2Dwh for " + period + " failed at " + new Date() + " Reason: " + error.message);
        });
    }
}