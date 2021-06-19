const Log = require("./GeraLog");
let lastValue = "";

function ClearField(id) {
    try {
        lastValue = document.getElementById(id).value;
        document.getElementById(id).value = "";
    }
    catch (err) {
        Log.LogError("ConfigTextFieldList", "ClearField", err.message);
    }
}
exports.ClearField = ClearField;


function ConfigControl(id) {
    try {
        let fieldValue = document.getElementById(id).value;

        if (fieldValue === "")
            document.getElementById(id).value = lastValue;
    }
    catch (err) {
        Log.LogError("ConfigTextFieldList", "ConfigControl", err.message);
    }
}
exports.ConfigControl = ConfigControl;