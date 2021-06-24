const fetch = require("node-fetch");
const ip = require('ip');

function LogError(screen, functionName, message) {
    fetch('http://' + ip.address() + ':5000/api/sgp/gera/log', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "screen": screen,
            "functionName": functionName,
            "message": message
        })
    }).then((response) => response.json()).then((res) => {
        //
    })
}
exports.LogError = LogError;