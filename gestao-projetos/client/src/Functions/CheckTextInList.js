const Log = require("./GeraLog");
const $ = require("jquery")

function IsInList(listId, textName) {
    try {
        let array = $(`#${listId} option`).map(function () { return this.value; }).get();
        return array.includes(textName);
    }
    catch (err) {
        Log.LogError("CheckTextInList", "IsInList", err.message);
    }
}
exports.IsInList = IsInList;