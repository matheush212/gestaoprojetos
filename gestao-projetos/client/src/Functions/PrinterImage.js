const Log = require("./GeraLog");

function Print() {
    try {
        window.print();
        return true;
    }
    catch (err) {
        Log.LogError("PrinterImage", "Print", err.message);
    }
}
exports.Print = Print;