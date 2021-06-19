const Log = require('./GeraLog');

function CSSBotoes(idComponent, w, h, rightValue=0) {
    let aplicarCss = false;

    try {
        if (w === 1920 && h === 1080) aplicarCss = true;
        else if (w === 1680 && h === 1050) aplicarCss = true;
        else if (w === 1600 && h === 900) aplicarCss = true;
        else if (w === 1440 && h === 900) aplicarCss = true;
        else if (w === 1400 && h === 1050) aplicarCss = true;
        else if (w === 1280 && h === 1024) aplicarCss = true;
        else if (w === 1280 && h === 960) aplicarCss = true;
        else if (w === 1152 && h === 864) aplicarCss = true;

        if(aplicarCss)
            AplicaCSS(idComponent, rightValue);
    }
    catch (err) {
        Log.LogError("ControleCSSBotoes", "CSSBotoes", err.message);
    }
}
exports.CSSBotoes = CSSBotoes;



function CSSBotoesPlus(idComponent, w, h, rightValue=0) {
    let aplicarCss = false;

    try {
        if (w === 1920 && h === 1080) aplicarCss = true;
        else if (w === 1680 && h === 1050) aplicarCss = true;
        else if (w === 1600 && h === 900) aplicarCss = true;
        else if (w === 1440 && h === 900) aplicarCss = true;
        else if (w === 1400 && h === 1050) aplicarCss = true;
        else if (w === 1366 && h === 768) aplicarCss = true;
        else if (w === 1360 && h === 768) aplicarCss = true;
        else if (w === 1280 && h === 1024) aplicarCss = true;
        else if (w === 1280 && h === 960) aplicarCss = true;
        else if (w === 1280 && h === 800) aplicarCss = true;
        else if (w === 1280 && h === 768) aplicarCss = true;
        else if (w === 1280 && h === 720) aplicarCss = true;
        else if (w === 1152 && h === 864) aplicarCss = true;
        else if (w === 1024 && h === 768) aplicarCss = true;

        if(aplicarCss)
            AplicaCSS(idComponent, rightValue);
    }
    catch (err) {
        Log.LogError("ControleCSSBotoes", "CSSBotoesPlus", err.message);
    }
}
exports.CSSBotoesPlus = CSSBotoesPlus;


function AplicaCSS(idComponent, rightValue) {
    document.getElementById(idComponent).style.setProperty("position", "fixed", 'important');
    document.getElementById(idComponent).style.setProperty("right", rightValue, 'important');
    document.getElementById(idComponent).style.setProperty("bottom", "4em", 'important');
}