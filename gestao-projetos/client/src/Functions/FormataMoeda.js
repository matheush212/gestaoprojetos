const Log = require("./GeraLog");

function FormataDinheiro(n) {
    try {
        let valueFormeted = parseFloat(n).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1");
        
        if(String(valueFormeted) === "NaN")
            return "R$ 0,00";
        else
            return "R$ " + valueFormeted;
    }
    catch (err) {
        Log.LogError("FormataMoeda", "FormataDinheiro", err.message);
    }
}
exports.FormataDinheiro = FormataDinheiro;


function ConvertToFloatNumber(n) {
    try {
        let valor = n;
        valor = valor.replace(/^\D+/g, '');
        valor = valor.replace(/\./g, "");
        valor = valor.replace(/,/g, '.');
        return valor;
    }
    catch (err) {
        Log.LogError("FormataMoeda", "ConvertToFloatNumber", err.message);
    }
}
exports.ConvertToFloatNumber = ConvertToFloatNumber;