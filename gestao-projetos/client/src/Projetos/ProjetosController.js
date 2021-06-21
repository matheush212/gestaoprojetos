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


    GetProjectsByDate(status, dataDe, dataAte, res) {
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            instaceDAO.SelectByDate(status, dataDe, dataAte, res);
        }
        catch (err) {
            Log.LogError("ProjetosController", "GetProjectsByDate", err.message);
        }
    }


    GetProjectsByFilter(status, filtro, text, res) {
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            instaceDAO.SelectByFilter(status, filtro, text, res);
        }
        catch (err) {
            Log.LogError("ProjetosController", "GetProjectsByFilter", err.message);
        }
    }


    ControleProjetoAtivo(idUsuario, status, res) {
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            instaceDAO.ControleAtivo(idUsuario, status, res);
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
}
exports.ProjetosController = ProjetosController;