const Log = require("./GeraLog");

function queryString(parameter) {
    try {
        let loc = window.location.search.substring(1, window.location.search.length);
        let param_value = false;
        let params = loc.split("&");
        for (let i = 0; i < params.length; i++) {
            let param_name = params[i].substring(0, params[i].indexOf('='));
            if (param_name === parameter) {
                param_value = params[i].substring(params[i].indexOf('=') + 1)
            }
        }
        if (param_value) {
            return param_value;
        }
        else {
            return undefined;
        }
    } 
    catch (err) {
        Log.LogError("GetUrlParameters", "queryString", err.message);
    }
}
exports.queryString = queryString;