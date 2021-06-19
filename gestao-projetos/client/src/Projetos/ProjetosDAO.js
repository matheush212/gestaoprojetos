const singletonDB = require('singleton-db');
const instanceDB = singletonDB.Instance.getInstance();
const GetJSONDataSQL = require('../Functions/GetJSONDataSQL');
const Log = require("../Functions/GeraLog");
const ATIVO = 1;

class ProjetosDAO {
    CriaNovoProjeto(objUser, res) {
        try {
            let sql = `INSERT INTO Projetos(TipoUsuario, Nome, Login, Email, Senha, DtCadastro, Ativo) VALUES 
                       ('${objUser.tipoUsuario}', '${objUser.nome}', '${objUser.login}', '${objUser.email}', '${hash}', '${objUser.dtCadastro}', '${objUser.ativo}')`;

            instanceDB.run(sql, [], function (err) {
                if (err) {
                    if (err.errno == 19)
                        res.json({ "status": 400, "message": "Este usuário ja existe! Por favor insira outro nome de usuário!" });
                    else
                        res.json({ "status": 400, "message": "Não foi possível cadastrar o usuário '" + objUser.login + "'!" });
                }
                else {
                    res.json({ "status": 200, "message": "Usuário '" + objUser.login + "' cadastrado com sucesso!", });
                }
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "CriaNovoProjeto", err.message);
        }
    }


    SelectAll(status, res) {
        try {
            let sql = `SELECT *, strftime('%d/%m/%Y', DtCadastro) as DataCadastro, strftime('%d/%m/%Y', DtInicio) as DataInicio, 
                       strftime('%d/%m/%Y', DtFinal) as DataFinal
                       FROM Projetos WHERE Ativo = ${status} ORDER BY DtCadastro DESC`;

            instanceDB.all(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, 'Projetos'));
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "SelectAll", err.message);
        }
    }


    SelectByFilter(status, filtro, text, res) {
        try {
            let sql = `SELECT *, strftime('%d/%m/%Y', DtCadastro) as DataCadastro, strftime('%d/%m/%Y', DtInicio) as DataInicio, 
                       strftime('%d/%m/%Y', DtFinal) as DataFinal
                       FROM Projetos `;

            if (filtro == "TipoUsuario")
                sql += `WHERE TipoUsuario LIKE '%${text}%' AND Ativo = ${status} ORDER BY DtCadastro DESC`;
            else if (filtro == "Nome")
                sql += `WHERE Nome LIKE '%${text}%' AND Ativo = ${status} ORDER BY DtCadastro DESC`;
            else if (filtro == "Login")
                sql += `WHERE Login LIKE '%${text}%' AND Ativo = ${status} ORDER BY DtCadastro DESC`;
            else if (filtro == "Email")
                sql += `WHERE Email LIKE '${text}%' AND Ativo = ${status} ORDER BY DtCadastro DESC`;
            else
                sql += `WHERE Ativo = ${status} ORDER BY DtCadastro DESC`;


            instanceDB.all(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, "Projeto(s)"));
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "SelectByFilter", err.message);
        }
    }


    SelectByDate(status, campo, dataDe, dataAte, res) {
        try {
            let sql = `SELECT *, strftime('%d/%m/%Y', DtCadastro) as DataCadastro, strftime('%d/%m/%Y', DtInicio) as DataInicio, 
                       strftime('%d/%m/%Y', DtFinal) as DataFinal
                       FROM Projetos 
                       WHERE DtCadastro >= '${dataDe}' AND DtCadastro <= '${dataAte}' AND Ativo = ${status} ORDER BY DtCadastro DESC`;

            instanceDB.all(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, "Projeto(s)"));
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "SelectByDate", err.message);
        }
    }


    ControleAtivo(idProjeto, status, res) {
        try {
            let sql = `UPDATE Projetos SET Ativo = ${status} WHERE Id = ${idProjeto}`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": 400, "message": err.message });
                else {
                    if (status == ATIVO)
                        res.json({ "status": 200, "message": "Projeto Reativado com Sucesso!" });
                    else
                        res.json({ "status": 200, "message": "Projeto Inativado com Sucesso!" });
                }
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "ControleAtivo", err.message);
        }
    }
}
exports.ProjetosDAO = ProjetosDAO;