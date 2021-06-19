let fs = require('fs');
let dateWithMinutes;
let onlyDate;


async function LogError(screen, functionName, message) {
    try {
        await GetFormatedData();

        fs.appendFile(`logs/ControleGestao_${onlyDate}.txt`, dateWithMinutes + " -> Tela: " + screen + " - Função: " + functionName + " - Erro: " + message + "\n\n", function (err, stat) {
            if (err)
                return;
        });

    } catch (err) {
        console.log(err.message);
    }
}
exports.LogError = LogError;


async function GetFormatedData() {
    let date = new Date();
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0');
    let yyyy = date.getFullYear();

    let hour = new Date();
    let h = hour.getHours();
    let m = hour.getMinutes();
    let s = hour.getSeconds();
    h = await CheckTimeLog(h);
    m = await CheckTimeLog(m);
    s = await CheckTimeLog(s);

    dateWithMinutes = dd + "/" + mm + "/" + yyyy + " " + h + ":" + m + ":" + s;
    onlyDate = dd + mm + yyyy;
}


async function CheckTimeLog(i) {
    if (i < 10) {
        i = "0" + i;
    }

    return i;
}