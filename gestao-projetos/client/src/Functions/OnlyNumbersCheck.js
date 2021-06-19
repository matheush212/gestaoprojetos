const Log = require("./GeraLog");

const isNumberStringFields = (n) => {
    try {
        return !isNaN(parseInt(n)) && isFinite(n);
    }
    catch (err) {
        Log.LogError("OnlyNumbersCheck", "isNumberStringFields", err.message);
    }
}
exports.isNumberStringFields = isNumberStringFields;