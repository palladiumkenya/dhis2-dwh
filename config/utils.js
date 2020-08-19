var moment = require("moment");

module.exports = {
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