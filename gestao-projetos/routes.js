const session = require('./session-control');
const log = require('./log-control');


async function GetRoutes(dirname, app) {
    try {
        app.get("/api/sgp/all/projects/:status/:token", (req, res, next) => {
            if (AuthControl(req.params.token, res)) {
                let controllerClass = require(dirname + '/client/src/Projetos/ProjetosController');
                let instanceController = new controllerClass.ProjetosController();
                instanceController.GetAllProjects(req.params.status, res);
            }
        });

        app.get("/api/sgp/get/project/by/id/:idProjeto/:token", (req, res, next) => {
            if (AuthControl(req.params.token, res)) {
                let controllerClass = require(dirname + '/client/src/Projetos/ProjetosController');
                let instanceController = new controllerClass.ProjetosController();
                instanceController.GetProjectByID(req.params.idProjeto, res);
            }
        });

        app.get("/api/sgp/all/activities/:status/:token", (req, res, next) => {
            if (AuthControl(req.params.token, res)) {
                let controllerClass = require(dirname + '/client/src/Atividades/AtividadesController');
                let instanceController = new controllerClass.AtividadesController();
                instanceController.GetAllActivities(req.params.status, res);
            }
        });

        app.get("/api/sgp/get/activity/by/id/:idActivity/:token", (req, res, next) => {
            if (AuthControl(req.params.token, res)) {
                let controllerClass = require(dirname + '/client/src/Atividades/AtividadesController');
                let instanceController = new controllerClass.AtividadesController();
                instanceController.GetActivityByID(req.params.idActivity, res);
            }
        });
    }
    catch (err) {
        log.LogError("routes", "GetRoutes", err.message);
    }
}
exports.GetRoutes = GetRoutes;


async function PostRoutes(dirname, app) {
    try {
        app.post("/api/sgp/new/profile/:id/:userID/:userType/:token", (req, res, next) => {
            session.SetProfile(req.params.id, req.params.userID, req.params.userType, req.params.token, res);
        });

        app.post("/api/sgp/get/profile/:token", (req, res, next) => {
            session.GetProfile(req.params.token, res);
        });

        app.post("/api/sgp/get/profile", (req, res, next) => {
            session.GetProfile(req.body.accessID, res);
        });

        app.post("/api/sgp/remove/profile/:token", (req, res, next) => {
            session.RemoveProfile(req.params.token, res);
        });

        app.post("/api/sgp/gera/log", (req, res, next) => {
            log.LogError(req.body.screen, req.body.functionName, req.body.message);
        });

        app.post("/api/sgp/check/login", (req, res, next) => {
            let controllerClass = require(dirname + '/client/src/Usuarios/UsuariosController');
            let instanceController = new controllerClass.UsuariosController();
            instanceController.GetAcessoLogin(req.body.login, req.body.password, res);
        });

        app.post("/api/sgb/new/project", (req, res, next) => {
            if (AuthControl(req.body.token, res)) {
                let controllerClass = require(dirname + '/client/src/Projetos/ProjetosController');
                let instanceController = new controllerClass.ProjetosController();
                instanceController.CriaNovoProjeto(req.body.nome, req.body.descricao, req.body.dtInicio, req.body.dtFinal, req.body.dtCadastro, res);
            }
        });

        app.post("/api/sgb/edit/project", (req, res, next) => {
            if (AuthControl(req.body.token, res)) {
                let controllerClass = require(dirname + '/client/src/Projetos/ProjetosController');
                let instanceController = new controllerClass.ProjetosController();
                instanceController.EditaProjeto(req.body.idProjeto, req.body.nome, req.body.descricao, req.body.dtInicio, req.body.dtFinal, req.body.finalizado, req.body.dtCadastro, res);
            }
        });

        app.post("/api/sgb/new/activity", (req, res, next) => {
            if (AuthControl(req.body.token, res)) {
                let controllerClass = require(dirname + '/client/src/Atividades/AtividadesController');
                let instanceController = new controllerClass.ProjetosController();
                instanceController.CriaNovaAtividade(req.body.nome, req.body.descricao, req.body.dtInicio, req.body.dtFinal, req.body.dtCadastro, res);
            }
        });

        app.post("/api/sgb/edit/activity", (req, res, next) => {
            if (AuthControl(req.body.token, res)) {
                let controllerClass = require(dirname + '/client/src/Atividades/AtividadesController');
                let instanceController = new controllerClass.ProjetosController();
                instanceController.EditaAtividade(req.body.idAtividade, req.body.idProjeto, req.body.nome, req.body.descricao, req.body.dtInicio, req.body.dtFinal, req.body.finalizado, req.body.dtCadastro, res);
            }
        });
    }
    catch (err) {
        log.LogError("routes", "PostRoutes", err.message);
    }
}
exports.PostRoutes = PostRoutes;


async function PutRoutes(dirname, app) {
    try {
        //
    }
    catch (err) {
        log.LogError("routes", "PutRoutes", err.message);
    }
}
exports.PutRoutes = PutRoutes;


async function DeleteRoutes(dirname, app) {
    try {
        //
    }
    catch (err) {
        log.LogError("routes", "DeleteRoutes", err.message);
    }
}
exports.DeleteRoutes = DeleteRoutes;


function AuthControl(token, res) {
    try {
        if (session.CheckProfileByKey(token))
            return true;
        else {
            res.json({ "status": 400, "message": "Autorização negada!" });
            return false;
        }
    }
    catch (err) {
        log.LogError("routes", "AuthControl", err.message);
    }
}