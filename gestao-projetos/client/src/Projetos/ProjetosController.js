const projetosDAO = require("./ProjetosDAO");
const projetos = require("./Projetos");
const Log = require("../Functions/GeraLog");


class ProjetosController {
    CriaNovoProjeto(tipoUsuario, nome, login, senha, dtCadastro, res) {
        try {
            let instaceDAO = new projetosDAO.ProjetosDAO();
            let objModel = new projetos.Projetos("", tipoUsuario, nome, login, senha, dtCadastro, 1);
            instaceDAO.CriaUsuario(objModel, res);
        }
        catch (err) {
            Log.LogError("ProjetosController", "CriaNovoProjeto", err.message);
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
}
exports.ProjetosController = ProjetosController;