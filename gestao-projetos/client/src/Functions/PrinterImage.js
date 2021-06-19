const Log = require("./GeraLog");

function Print() {
    try {
        //var r = window.confirm("Deseja gerar um PDF?");
        //if (r === true) {
        //    var pdf = new jsPDF('r', 'mm', [2000, 1000]);
        //    var options = {
        //        pagesplit: true
        //    };

        //    pdf.fromHTML(document.getElementById(idComponent), 90, 10, options, {});
        //    pdf.output("dataurlnewwindow");
        //}
        //else{
        window.print();
        return true;
        //}
    }
    catch (err) {
        Log.LogError("PrinterImage", "Print", err.message);
    }
}
exports.Print = Print;