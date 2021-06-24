import PopUp from './PopUp';
const urlBase = 'http://' + window.location.hostname + ':5000/api/sgp';
const AuthenticationSession = require('../../Autenticacao/AutenticacaoSession');


const ConsomeApi = async (urlNotNeedAutenticated, parametro, routeMethod) => {
    if (await AuthenticationSession.Authorize() || urlNotNeedAutenticated) {
        return fetch(`${urlBase}/${parametro}`, { method: routeMethod, headers: { 'content-type': 'application/json' } })
            .then(res => ApiService.TrataErros(res))
            .then(res => res.json())
    }
    else {
        PopUp.ExibeMensagem('error', 'Autorização negada!');
        return;
    }
}


const ApiService = {
    SaveUserProfile: (id, userID, userType, token) => ConsomeApi(true, `new/profile/${id}/${userID}/${userType}/${token}`, 'POST'),
    GetUserProfile: (token) => ConsomeApi(true, `get/profile/${token}`, 'POST'),
    GetDadosUser: (idUsuario, token) => ConsomeApi(false, `get/dados/user/${idUsuario}/${token}`, 'POST'),
    AllProjects: (status, token) => ConsomeApi(true, `all/projects/${status}/${token}`, 'GET'),
    ProjectByID: (idProjeto, token) => ConsomeApi(true, `get/project/by/id/${idProjeto}/${token}`, 'GET'),
    AllActivities: (idProjeto, status, token) => ConsomeApi(true, `all/activities/${idProjeto}/${status}/${token}`, 'GET'),
    ActivityByID: (idAtividade, token) => ConsomeApi(true, `get/activity/by/id/${idAtividade}/${token}`, 'GET'),
    ControleProjetoAtivo: (idProjeto, status, token) => ConsomeApi(false, `controle/projeto/ativo/${idProjeto}/${status}/${token}`, 'PUT'),
    ControleAtividadeAtiva: (idAtividade, status, token) => ConsomeApi(false, `controle/atividade/ativa/${idAtividade}/${status}/${token}`, 'PUT'),
    ExcluiProjeto: (idProjeto, token) => ConsomeApi(false, `remove/projeto/${idProjeto}/${token}`, 'DELETE'),
    ExcluiAtividade: (idAtividade, token) => ConsomeApi(false, `remove/atividade/${idAtividade}/${token}`, 'DELETE'),
    Informacoes: (token) => ConsomeApi(false, `get/informacoes/${token}`, 'GET'),
    TrataErros: res => {
        if (!res.ok) {
            throw Error(res.responseText)
        }
        return res
    }
}
export default ApiService