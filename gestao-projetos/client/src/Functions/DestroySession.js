const fetch = require("node-fetch");
const ip = require('ip');
const PopUp = require('../React/Utils/PopUp');
const Log = require('./GeraLog');

function Destroy(tokenRef) {
    fetch('http://' + ip.address() + ':5000/api/sgp/remove/profile', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ "token": tokenRef })
    }).then(res => {
        if (res.status === 200)
            window.location.href = "/";
        else {
            PopUp.default.ExibeMensagem('error', "Não foi possível encerrar a sessão!");
            Log.LogError("Functions", "DestroySession", res.message);
        }
    }).catch(err => {
        PopUp.default.ExibeMensagem('error', "Não foi possível comunicar com a API");
        Log.LogError("Functions", "DestroySession", err.message);
    });
}
exports.Destroy = Destroy;