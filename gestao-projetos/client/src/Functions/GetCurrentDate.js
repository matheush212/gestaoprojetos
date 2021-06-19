const Log = require("./GeraLog");

function ReturnCurrentDate() {
    try {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }
    catch (err) {
        Log.LogError("GetCurrentDate", "ReturnCurrentDate", err.message);
    }
}
exports.ReturnCurrentDate = ReturnCurrentDate;


function ReturnCurrentDateHour() {
    try {
        let date = new Date();
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();

        let hour = new Date();
        let h = hour.getHours();
        let m = hour.getMinutes();
        h = checkTimeEdicao(h);
        m = checkTimeEdicao(m);
        return yyyy + "-" + mm + "-" + dd + "=" + h + ":" + m;
    }
    catch (err) {
        Log.LogError("GetCurrentDate", "ReturnCurrentDateHour", err.message);
    }
}
exports.ReturnCurrentDateHour = ReturnCurrentDateHour;


function checkTimeEdicao(i) {
    try {
        if (i < 10) {
            i = "0" + i;
        }

        return i;
    }
    catch (err) {
        Log.LogError("GetCurrentDate", "checkTimeEdicao", err.message);
    }
}