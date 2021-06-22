const singletonDB = require('singleton-db');
const instanceDB = singletonDB.Instance.getInstance();
const GetJSONDataSQL = require('../Functions/GetJSONDataSQL');
const Log = require("../Functions/GeraLog");
const ATIVO = 1;

class ProjetosDAO {
    NewProject(obj, res) {
        try {
            let sql = `INSERT INTO Projetos(Nome, Descricao, DtInicio, DtFinal, Porcentagem, Atrasado, Finalizado, DtCadastro, Ativo) VALUES 
                       ('${obj.nome}', '${obj.descricao}', '${obj.dtInicio}', '${obj.dtFinal}', ${obj.porcentagem}, ${obj.atrasado}, ${obj.finalizado}, 
                       '${obj.dtCadastro}', ${obj.ativo})`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": 400, "message": "Não foi possível cadastrar o projeto '" + objUser.nome + "'!" });
                else
                    res.json({ "status": 200, "message": "Projeto '" + obj.nome + "' cadastrado com sucesso!" });
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "NewProject", err.message);
        }
    }


    SelectByID(idProjeto, res) {
        try {
            let sql = `SELECT * FROM Projetos WHERE Id = ${idProjeto} AND Ativo = 1`;

            instanceDB.get(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, 'Projeto'));
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "SelectByID", err.message);
        }
    }


    SelectAll(status, res) {
        try {
            let sql = `SELECT *, substr(Nome, 0, 40) as NomeProjeto, strftime('%d/%m/%Y', DtCadastro) as DataCadastro, strftime('%d/%m/%Y', DtInicio) as DataInicio, 
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
            let sql = `SELECT *, substr(Nome, 0, 40) as NomeProjeto, strftime('%d/%m/%Y', DtCadastro) as DataCadastro, strftime('%d/%m/%Y', DtInicio) as DataInicio, 
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
            let sql = `SELECT *, substr(Nome, 0, 40) as NomeProjeto, strftime('%d/%m/%Y', DtCadastro) as DataCadastro, strftime('%d/%m/%Y', DtInicio) as DataInicio, 
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


    EditProject(obj, res) {
        try {
            let sql = `UPDATE Projetos SET Nome='${obj.nome}', Descricao='${obj.descricao}', DtInicio='${obj.dtInicio}', DtFinal='${obj.dtFinal}', Finalizado=${obj.finalizado},
                       DtCadastro='${obj.dtCadastro}' WHERE Id=${obj.id}`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": 400, "message": err.message });
                else
                    res.json({ "status": 200, "message": "Projeto editado com sucesso!" });
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "EditProject", err.message);
        }
    }

}
exports.ProjetosDAO = ProjetosDAO;