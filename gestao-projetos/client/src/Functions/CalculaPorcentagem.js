const moment = require('moment');
let Log = require('./GeraLog');
let p100, p95, p90, p85, p80, p75, p70, p65, p60, p55, p50, p45, p40, p35, p30, p25, p20, p15, p10, p05, p00 = 0;

function GetDiferencaEmDias(dtInicio, dtFinal) {
    try {
        let mmtInicio = moment(new Date(dtInicio));
        let mmtFinal = moment(new Date(dtFinal));
        let mmtAtual = moment(new Date());

        let diferencaEmDiasProjeto = Math.abs(mmtFinal.diff(mmtInicio, 'days'));
        let diferencaEmDiasAteOMomento = Math.abs(mmtAtual.diff(mmtInicio, 'days'));

        return CalculaPorcentagens(diferencaEmDiasProjeto, diferencaEmDiasAteOMomento);
    }
    catch (err) {
        Log.LogError("CalculaPorcentagem", "GetDiferencaEmDias", err.message);
        return -99;
    }
}
exports.GetDiferencaEmDias = GetDiferencaEmDias;


function CalculaPorcentagens(valorTotal, valorAtual) {
    try {
        p100 = Number(valorTotal * 1.0);
        p95 = Number(valorTotal * 0.95);
        p90 = Number(valorTotal * 0.90);
        p85 = Number(valorTotal * 0.85);
        p80 = Number(valorTotal * 0.8);
        p75 = Number(valorTotal * 0.75);
        p70 = Number(valorTotal * 0.7);
        p65 = Number(valorTotal * 0.65);
        p60 = Number(valorTotal * 0.6);
        p55 = Number(valorTotal * 0.55);
        p50 = Number(valorTotal * 0.5);
        p45 = Number(valorTotal * 0.45);
        p40 = Number(valorTotal * 0.4);
        p35 = Number(valorTotal * 0.35);
        p30 = Number(valorTotal * 0.3);
        p25 = Number(valorTotal * 0.25);
        p20 = Number(valorTotal * 0.2);
        p15 = Number(valorTotal * 0.15);
        p10 = Number(valorTotal * 0.1);
        p05 = Number(valorTotal * 0.05);
        p00 = Number(valorTotal * 0);

        return SetValorPorcentagem(valorAtual);
    }
    catch (err) {
        Log.LogError("CalculaPorcentagem", "CalculaPorcentagens", err.message);
        return -99;
    }
}
exports.CalculaPorcentagens = CalculaPorcentagens;


function SetValorPorcentagem(diffDaysAteOMomento) {
    try {
        if (diffDaysAteOMomento >= p100) return 100;
        else if (diffDaysAteOMomento > p90 && diffDaysAteOMomento <= p95) return 95;
        else if (diffDaysAteOMomento > p85 && diffDaysAteOMomento <= p90) return 90
        else if (diffDaysAteOMomento > p80 && diffDaysAteOMomento <= p85) return 85
        else if (diffDaysAteOMomento > p75 && diffDaysAteOMomento <= p80) return 80
        else if (diffDaysAteOMomento > p70 && diffDaysAteOMomento <= p75) return 75
        else if (diffDaysAteOMomento > p65 && diffDaysAteOMomento <= p70) return 70
        else if (diffDaysAteOMomento > p60 && diffDaysAteOMomento <= p65) return 65
        else if (diffDaysAteOMomento > p55 && diffDaysAteOMomento <= p60) return 60
        else if (diffDaysAteOMomento > p50 && diffDaysAteOMomento <= p55) return 55
        else if (diffDaysAteOMomento > p45 && diffDaysAteOMomento <= p50) return 50
        else if (diffDaysAteOMomento > p40 && diffDaysAteOMomento <= p45) return 45
        else if (diffDaysAteOMomento > p35 && diffDaysAteOMomento <= p40) return 40
        else if (diffDaysAteOMomento > p30 && diffDaysAteOMomento <= p35) return 35
        else if (diffDaysAteOMomento > p25 && diffDaysAteOMomento <= p30) return 30
        else if (diffDaysAteOMomento > p20 && diffDaysAteOMomento <= p25) return 25
        else if (diffDaysAteOMomento > p15 && diffDaysAteOMomento <= p20) return 20
        else if (diffDaysAteOMomento > p10 && diffDaysAteOMomento <= p15) return 15
        else if (diffDaysAteOMomento > p05 && diffDaysAteOMomento <= p10) return 10
        else if (diffDaysAteOMomento > p00 && diffDaysAteOMomento <= p05) return 5
        else return 0
    }
    catch (err) {
        Log.LogError("CalculaPorcentagem", "SetValorPorcentagem", err.message);
        return -99;
    }
}