const projetosDAO = require("./ProjetosDAO");
const projetos = require("./Projetos");
const Log = require("../Functions/GeraLog");


class ProjetosController {
    CriaNovoProjeto(nome, descricao, dtInicio, dtFinal, dtCadastro, res) {
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            let objModel = new projetos.Projetos("", nome, descricao, dtInicio, dtFinal, 0, 0, 0, dtCadastro, 1);
            instaceDAO.NewProject(objModel, res);
        }
        catch (err) {
            Log.LogError("ProjetosController", "CriaNovoProjeto", err.message);
        }
    }


    GetProjectByID(idProjeto, res) {
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            instaceDAO.SelectByID(idProjeto, res);
        }
        catch (err) {
            Log.LogError("ProjetosController", "GetProjectByID", err.message);
        }
    }


    GetAllProjects(status, res) {
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            instaceDAO.SelectAll(status, res);
        }
        catch (err) {
            Log.LogError("ProjetosController", "GetAllProjects", err.message);
        }
    }


    ControleProjetoAtivo(idProjeto, status, res) {
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            instaceDAO.ControleAtivo(idProjeto, status, res);
        }
        catch (err) {
            Log.LogError("ProjetosController", "ControleProjetoAtivo", err.message);
        }
    }


    EditaProjeto(idProjeto, nome, descricao, dtInicio, dtFinal, finalizado, dtCadastro, res) {
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            let objModel = new projetos.Projetos(idProjeto, nome, descricao, dtInicio, dtFinal, 0, 0, finalizado, dtCadastro, 1);
            instaceDAO.EditProject(objModel, res);
        }
        catch (err) {
            Log.LogError("ProjetosController", "EditaProjeto", err.message);
        }
    }


    ControleFiltrosProjeto(filters, res) {
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            instaceDAO.SelectByFilter(filters, res);
        }
        catch (err) {
            Log.LogError("ProjetosController", "ControleProjetoAtivo", err.message);
        }
    }


    ExcluiProjeto(idProjeto, res) {
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            instaceDAO.RemoveAtividade(idProjeto, res);
        }
        catch (err) {
            Log.LogError("ProjetosController", "ExcluiProjeto", err.message);
        }
    }


    GetInformacoes(res){
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            instaceDAO.SelectInfo(res);
        }
        catch (err) {
            Log.LogError("ProjetosController", "GetInformacoes", err.message);
        }
    }
}
exports.ProjetosController = ProjetosController;