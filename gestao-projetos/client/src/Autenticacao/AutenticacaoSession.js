const jwt = require('jsonwebtoken');
const SALT_KEY = 'f5b99242-6504-4ca3-90f2-05e78e5761ef';
const urlParam = require('../Functions/GetUrlParameters');
const Log = require("../Functions/GeraLog");

exports.GenerateToken = async (data) => {
    try {
        return jwt.sign(data, SALT_KEY, { expiresIn: '10h' });
    }
    catch (err) {
        Log.LogError("AutenticacaoSession", "GenerateToken", err.message);
    }
}

exports.Authorize = async () => {
    try {
        let res = await GetAccess();

        if (res === null || res.status === 400)
            return false;

        res = await res.json();

        let token = res.data[0].Token;
        let userID = res.data[0].UserID;
        if (token !== "" && token !== "null") {
            let data = jwt.verify(token, SALT_KEY);

            if (data.id_user === parseInt(userID))
                return true;
            else {
                return false;
            }
        }
        else
            return false;
    }
    catch (err) {
        Log.LogError("AutenticacaoSession", "Authorize", err.message);
        return false; //Retorna false, pois se cair no catch, significa que o token expirou
    }
}


async function GetAccess() {
    try {
        let accessID = urlParam.queryString("Ref");

        if (accessID === undefined)
            return null;

        return await window.fetch('http://' + window.location.hostname + ':5000/api/sgp/get/profile', {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "accessID": accessID,
            })
        });
    }
    catch (err) {
        Log.LogError("AutenticacaoSession", "GetAccess", err.message);
        return null; 
    }
}
