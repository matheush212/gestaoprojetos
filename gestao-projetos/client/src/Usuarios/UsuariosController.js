const userDAO = require("./UsuariosDAO");
const user = require("./Usuarios");
const Log = require("../Functions/GeraLog");
const autenticacaoSession = require('../Autenticacao/AutenticacaoSession');
const STATUS_200 = 200;
const STATUS_400 = 400;

class UsuariosController {
    CriaNovoUsuario(tipoUsuario, nome, login, senha, dtCadastro, res) {
        try {
            let instaceUserDAO = new userDAO.UsuariosDAO();
            let objUserModel = new user.Usuarios("", tipoUsuario, nome, login, senha, dtCadastro, 1);
            instaceUserDAO.CriaUsuario(objUserModel, res);
        }
        catch (err) {
            Log.LogError("UsuariosController", "CriaNovoUsuario", err.message);
        }
    }


    GetAllUsuarios(status, res) {
        try {
            let instaceUserDAO = new userDAO.UsuariosDAO();
            instaceUserDAO.SelectAllUsuarios(status, res);
        }
        catch (err) {
            Log.LogError("UsuariosController", "GetAllUsuarios", err.message);
        }
    }


    GetUsuariosByDate(status, dataDe, dataAte, res) {
        try {
            let instaceUserDAO = new userDAO.UsuariosDAO();
            instaceUserDAO.SelectUsuariosByDate(status, dataDe, dataAte, res);
        }
        catch (err) {
            Log.LogError("UsuariosController", "GetUsuariosByDate", err.message);
        }
    }


    GetUsuariosByFilter(status, filtro, text, res) {
        try {
            let instaceUserDAO = new userDAO.UsuariosDAO();
            instaceUserDAO.SelectUsuariosByFilter(status, filtro, text, res);
        }
        catch (err) {
            Log.LogError("UsuariosController", "GetUsuariosByFilter", err.message);
        }
    }


    GetResumoGeralUsuarios(status, dataDe, dataAte, res) {
        try {
            let instaceUserDAO = new userDAO.UsuariosDAO();
            instaceUserDAO.ResumoGeral(status, dataDe, dataAte, res);
        }
        catch (err) {
            Log.LogError("UsuariosController", "GetResumoGeralUsuarios", err.message);
        }
    }


    GetResumoTotalUsuarios(status, res) {
        try {
            let instaceUserDAO = new userDAO.UsuariosDAO();
            instaceUserDAO.ResumoTotal(status, res);
        }
        catch (err) {
            Log.LogError("UsuariosController", "GetResumoTotalUsuarios", err.message);
        }
    }


    GetAcessoLogin(login, password, res) {
        try {
            let _this = this;
            let instaceUserDAO = new userDAO.UsuariosDAO();
            let objUserModel = new user.Usuarios("", "", "", login, password, "", 1);
            instaceUserDAO.SelectLogin(objUserModel, function (dataResult) {
                _this.ValidaDadosUsuario(dataResult, res);
            });
        }
        catch (err) {
            Log.LogError("UsuariosController", "GetAcessoLogin", err.message);
        }
    }


    GetDadosUser(idUsuario, res) {
        try {
            let instaceUserDAO = new userDAO.UsuariosDAO();
            instaceUserDAO.SelectUserPerfil(idUsuario, res);
        }
        catch (err) {
            Log.LogError("UsuariosController", "GetAcessoLogin", err.message);
        }
    }


    ValidaDadosUsuario(dataResult, res) {
        try {
            if (dataResult != "") {
                if (dataResult[0].status == STATUS_200)
                    this.GeraTokenAutenticacao(dataResult, res);
                else
                    this.ReturnDadosJSON(dataResult, null, res);
            }
            else
                this.ReturnDadosJSON(null, null, res);
        }
        catch (err) {
            Log.LogError("UsuariosController", "ValidaDadosUsuario", err.message);
        }
    }


    GeraTokenAutenticacao(dataResult, res) {
        try {
            autenticacaoSession.GenerateToken({ id_user: dataResult[0].data.Id })
                .then(token => {
                    this.ReturnDadosJSON(dataResult, token, res);
                });
        }
        catch (err) {
            Log.LogError("UsuariosController", "GeraTokenAutenticacao", err.message);
        }
    }


    ReturnDadosJSON(dataResult, token, res) {
        try {
            if (dataResult != null) {
                res.json({
                    "status": dataResult[0].status,
                    "message": dataResult[0].message,
                    "data": dataResult[0].data,
                    "token": token
                });
            }
            else {
                res.json({ "status": STATUS_400, "message": "Usuário ou E-mail Incorretos" });
            }
        }
        catch (err) {
            Log.LogError("UsuariosController", "ReturnDadosJSON", err.message);
        }
    }


    ControleUsuarioAtivo(idUsuario, status, res) {
        try {
            let instaceUserDAO = new userDAO.UsuariosDAO();
            instaceUserDAO.ControleAtivo(idUsuario, status, res);
        }
        catch (err) {
            Log.LogError("UsuariosController", "ControleUsuarioAtivo", err.message);
        }
    }
}
exports.UsuariosController = UsuariosController;