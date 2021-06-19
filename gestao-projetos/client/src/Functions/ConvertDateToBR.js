const moment = require("moment");
const Log = require("./GeraLog");

function ConvertDateHour(dateHour) {
    try {
        let dataHourConverted = moment(dateHour, "YYYY-MM-DD hh:mm");
        return dataHourConverted.format("DD/MM/YYYY hh:mm");
    }
    catch (err) {
        Log.LogError("ConvertDateToBR", "ConvertDateHour", err.message);
    }
}
exports.ConvertDateHour = ConvertDateHour;


function ConvertDate(date) {
    try {
        let dataConverted = moment(date, "YYYY-MM-DD");
        return dataConverted.format("DD/MM/YYYY");
    }
    catch (err) {
        Log.LogError("ConvertDateToBR", "ConvertDate", err.message);
    }
}
exports.ConvertDate = ConvertDate;