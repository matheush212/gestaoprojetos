var session_profile_list = [];

var SetProfile = (id, userID, userType, token, res) => {
    try {
        session_profile_list.push({ AccessID:String(id), UserID:String(userID), UserType:String(userType), Token:String(token) });
        res.json({ "status": 200, "message": "Profile criado com sucesso!" });
    }
    catch(err){
        res.json({ "status": 400, "message": err.message });
    }
};
exports.SetProfile = SetProfile;


var GetProfile = (accessID, res) => {
    try {
        let profile = session_profile_list.filter((obj) => {
            if(obj.AccessID == accessID)
                return obj;
        });

        if(profile[0] == undefined)
            return res.json({"status": 400, "message": "Chave de acesso não encontrada! A sessão será encerrada!"});
        else
            return res.json({"status": 200, "message": "Profile encontrado!", "data": profile});
    }
    catch (err) {
        return res.json({"status": 400, "message": err.message});
    }
};
exports.GetProfile = GetProfile;


var RemoveProfile = (accessID, res) => {
    let numberOfProfiles = session_profile_list.length;
    session_profile_list = session_profile_list.filter((obj) => {
        return obj.AccessID != accessID;
    });

    if(numberOfProfiles > session_profile_list.length)
        return res.json({"status": 200, "message": "Profile removido!"});
    else
        return res.json({"status": 400, "message": "Não foi possível remover o profile!"});
}
exports.RemoveProfile = RemoveProfile;



var CheckProfileByKey = (accessID) => {
    try {
        let profile = session_profile_list.filter((obj) => {
            if(obj.AccessID == accessID)
                return obj;
        });

        if(profile[0] == undefined)
            return false;
        else
            return true;
    }
    catch (err) {
        return false;
    }
};
exports.CheckProfileByKey = CheckProfileByKey;