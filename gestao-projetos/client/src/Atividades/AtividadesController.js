const atividadesDAO = require("./AtividadesDAO");
const atividades = require("./Atividades");
const Log = require("../Functions/GeraLog");


class AtividadesController {
    CriaNovaAtividade(idProjeto, nome, descricao, dtInicio, dtFinal, dtCadastro, res) {
        try {
            let instaceDAO = new atividadesDAO.AtividadesDAO();
            let objModel = new atividades.Atividades("", idProjeto, nome, descricao, dtInicio, dtFinal, 0, 0, 0, dtCadastro, 1);
            instaceDAO.NewActivity(objModel, res);
        }
        catch (err) {
            Log.LogError("AtividadesController", "CriaNovaAtividade", err.message);
        }
    }


    GetActivityByID(idActivity, res) {
        try {
            let instaceDAO = new atividadesDAO.AtividadesDAO();
            instaceDAO.SelectByID(idActivity, res);
        }
        catch (err) {
            Log.LogError("AtividadesController", "GetActivityByID", err.message);
        }
    }


    GetAllActivities(idProjeto, status, res) {
        try {
            let instaceDAO = new atividadesDAO.AtividadesDAO();
            instaceDAO.SelectAll(idProjeto, status, res);
        }
        catch (err) {
            Log.LogError("AtividadesController", "GetAllActivities", err.message);
        }
    }


    ControleAtividadeAtiva(idAtividade, status, res) {
        try {
            let instaceDAO = new atividadesDAO.AtividadesDAO();
            instaceDAO.ControleAtivo(idAtividade, status, res);
        }
        catch (err) {
            Log.LogError("AtividadesController", "ControleProjetoAtivo", err.message);
        }
    }


    EditaAtividade(idAtividade, idProjeto, nome, descricao, dtInicio, dtFinal, finalizado, dtCadastro, res) {
        try {
            let instaceDAO = new atividadesDAO.AtividadesDAO();
            let objModel = new atividades.Atividades(idAtividade, idProjeto, nome, descricao, dtInicio, dtFinal, 0, 0, finalizado, dtCadastro, 1);
            instaceDAO.EditActivity(objModel, res);
        }
        catch (err) {
            Log.LogError("AtividadesController", "EditaAtividade", err.message);
        }
    }


    ControleFiltrosAtividade(idProjeto, filters, res) {
        try {
            let instaceDAO = new atividadesDAO.AtividadesDAO();
            instaceDAO.SelectByFilter(idProjeto, filters, res);
        }
        catch (err) {
            Log.LogError("AtividadesController", "ControleFiltrosAtividade", err.message);
        }
    }


    ExcluiAtividade(idAtividade, res) {
        try {
            let instaceDAO = new atividadesDAO.AtividadesDAO();
            instaceDAO.RemoveAtividade(idAtividade, res);
        }
        catch (err) {
            Log.LogError("AtividadesController", "ExcluiAtividade", err.message);
        }
    }
}
exports.AtividadesController = AtividadesController;