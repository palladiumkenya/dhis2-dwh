var seq = require('../config/database');
var sequelize = seq.sequelize;
var Sequelize = seq.Sequelize;
var moment = require('moment');

var FACT_PMTCT_DHIS2 = sequelize.define('FACT_PMTCT_DHIS2', {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    DHISOrgId: {type: Sequelize.STRING},
    SiteCode: {type: Sequelize.STRING},
    FacilityName: {type: Sequelize.STRING},
    County: {type: Sequelize.STRING},
    SubCounty: {type: Sequelize.STRING},
    Ward: {type: Sequelize.STRING},
    ReportMonth_Year: {type: Sequelize.STRING},
    "1stAncVisits": {type: Sequelize.INTEGER},
    deliveryFromHivPosMothers: {type: Sequelize.INTEGER},
    knownPosAt1stAnc: {type: Sequelize.INTEGER},
    intialTestAtAnc: {type: Sequelize.INTEGER},
    "initialTestAtL&D": {type: Sequelize.INTEGER},
    "initialTestAtPnc<=6wks": {type: Sequelize.INTEGER},
    knownHivStatusTotal: {type: Sequelize.INTEGER},
    "retestingPnc<=6wks": {type: Sequelize.INTEGER},
    "testedPnc>6wksTo6mnts": {type: Sequelize.INTEGER},
    knowPosAt1stAnc: {type: Sequelize.INTEGER},
    posResultsAnc: {type: Sequelize.INTEGER},
    "posResultsL&D": {type: Sequelize.INTEGER},
    "posResultsPnc<=6wks": {type: Sequelize.INTEGER},
    "posPnc>6wksTo6mnts": {type: Sequelize.INTEGER},
    totalPos: {type: Sequelize.INTEGER},
    onHAARTat1stAnc: {type: Sequelize.INTEGER},
    startHAARTanc: {type: Sequelize.INTEGER},
    "startHAARTL&D": {type: Sequelize.INTEGER},
    "startHAARTpnc<=6wks": {type: Sequelize.INTEGER},
    onMaternalHAARTtotal: {type: Sequelize.INTEGER},
    "startHAARTPnc>6wksto6mnts": {type: Sequelize.INTEGER},
    onMaternalHAART12mnts: {type: Sequelize.INTEGER},
    newCohort12mths: {type: Sequelize.INTEGER},
    syphilisScreened1stanc: {type: Sequelize.INTEGER},
    syphilisScreenedPos: {type: Sequelize.INTEGER},
    syphilisTreated: {type: Sequelize.INTEGER},
    HIVposMordernFP6wks: {type: Sequelize.INTEGER},
    HIVposPncVisits6wks: {type: Sequelize.INTEGER},
    knownStatus1stContact: {type: Sequelize.INTEGER},
    initialTestANCMale: {type: Sequelize.INTEGER},
    initialTestPncMale: {type: Sequelize.INTEGER},
    "initialTestL&DMale": {type: Sequelize.INTEGER},
    totalKnownStatusMale: {type: Sequelize.INTEGER},
    "1stAncKPAdolescencts": {type: Sequelize.INTEGER},
    PosResultAdolescents: {type: Sequelize.INTEGER},
    StartedHAARTAdolescentsTotal: {type: Sequelize.INTEGER},
    knownExposureAtPenta1: {type: Sequelize.INTEGER},
    totalGivenPenta1: {type: Sequelize.INTEGER},
    infantARVProphylANC: {type: Sequelize.INTEGER},
    "infantARVProphylL&D": {type: Sequelize.INTEGER},
    "infantARVProphyl<8wksPNC": {type: Sequelize.INTEGER},
    totalARVProphyl: {type: Sequelize.INTEGER},
    "HEICtxDdsStart<2mnts": {type: Sequelize.INTEGER},
    "initialPCR<8wks": {type: Sequelize.INTEGER},
    "initialPCR>8wksTo12mnts": {type: Sequelize.INTEGER},
    "initialPCRtest<12mntsTotal": {type: Sequelize.INTEGER},
    infected24mnts: {type: Sequelize.INTEGER},
    uninfected24mnts: {type: Sequelize.INTEGER},
    unknownOutcome: {type: Sequelize.INTEGER},
    netCohortHEI24mnts: {type: Sequelize.INTEGER},
    motherBabyPairs24mnts: {type: Sequelize.INTEGER},
    pairNetCohort24mnts: {type: Sequelize.INTEGER},
    EBFat6mnts: {type: Sequelize.INTEGER},
    ERFat6mnts: {type: Sequelize.INTEGER},
    MFat6mnts: {type: Sequelize.INTEGER},
    BFat12mnts: {type: Sequelize.INTEGER},
    notBFat12mnts: {type: Sequelize.INTEGER},
    BFat18mnts: {type: Sequelize.INTEGER},
    notBFat18mnts: {type: Sequelize.INTEGER}

}, {
    timestamps: true,
    freezeTableName: true,
    indexes: [
        {unique: true, fields: ['id']},
        {unique: false, fields: ['DHISOrgId']},
        {unique: false, fields: ['SiteCode']},
        {unique: false, fields: ['FacilityName']},
        {unique: false, fields: ['County']},
        {unique: false, fields: ['SubCounty']},
        {unique: false, fields: ['Ward']},
        {unique: false, fields: ['ReportMonth_Year']}
    ]
});

FACT_PMTCT_DHIS2.sync();

module.exports = {
    find: function (options) {
        options.order = [['updatedAt', 'DESC']];
        return FACT_PMTCT_DHIS2.findAndCountAll(options);
    },
    create: function (body) {
        var options = {
            where: {DHISOrgId: body.DHISOrgId, ReportMonth_Year: body.ReportMonth_Year},
            order: [['updatedAt', 'DESC']]
        };
        return FACT_PMTCT_DHIS2.findOne(options).then(function (data) {
            if (data) {
                body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
                return data.update(body);
            } else {
                return FACT_PMTCT_DHIS2.create(body);
            }
        });
    },
    update: function (body) {
        if (body.id) {
            return FACT_PMTCT_DHIS2.findById(body.id).then(function (data) {
                if (data) {
                    body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
                    return data.update(body);
                } else {
                    return this.create(body);
                }
            });
        }
        return this.create(body);
    }
}