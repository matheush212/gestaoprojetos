const singletonDB = require('singleton-db');
const instanceDB = singletonDB.Instance.getInstance();
const GetJSONDataSQL = require('../Functions/GetJSONDataSQL');
const Log = require("../Functions/GeraLog");
const ATIVO = 1;

class AtividadesDAO {
    NewActivity(obj, res) {
        try {
            let sql = `INSERT INTO Atividades(IdProjeto, Nome, Descricao, DtInicio, DtFinal, Porcentagem, Atrasado, Finalizado, DtCadastro, Ativo) VALUES 
                       (${obj.idProjeto}, '${obj.nome}', '${obj.descricao}', '${obj.dtInicio}', '${obj.dtFinal}', ${obj.porcentagem}, ${obj.atrasado}, ${obj.finalizado}, 
                       '${obj.dtCadastro}', ${obj.ativo})`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": 400, "message": "Não foi possível cadastrar a atividade '" + objUser.login + "'!" });
                else
                    res.json({ "status": 200, "message": "Atividade '" + obj.nome + "' cadastrada com sucesso!" });
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "NewActivity", err.message);
        }
    }


    SelectByID(idAtividade, res) {
        try {
            let sql = `SELECT * FROM Atividades WHERE Id = ${idAtividade} AND Ativo = 1`;

            instanceDB.get(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, 'Atividade'));
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "SelectByID", err.message);
        }
    }


    SelectAll(status, res) {
        try {
            let sql = `SELECT *, substr(Nome, 0, 40) as NomeAtividade, strftime('%d/%m/%Y', DtCadastro) as DataCadastro, strftime('%d/%m/%Y', DtInicio) as DataInicio, 
                       strftime('%d/%m/%Y', DtFinal) as DataFinal
                       FROM Atividades WHERE Ativo = ${status} ORDER BY DtCadastro DESC`;

            instanceDB.all(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, 'Atividades'));
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "SelectAll", err.message);
        }
    }


    SelectByFilter(status, filtro, text, res) {
        try {
            let sql = `SELECT *, substr(Nome, 0, 40) as NomeAtividade, strftime('%d/%m/%Y', DtCadastro) as DataCadastro, strftime('%d/%m/%Y', DtInicio) as DataInicio, 
                       strftime('%d/%m/%Y', DtFinal) as DataFinal
                       FROM Atividades `;

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
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, "Atividade(s)"));
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "SelectByFilter", err.message);
        }
    }


    SelectByDate(status, campo, dataDe, dataAte, res) {
        try {
            let sql = `SELECT *, substr(Nome, 0, 40) as NomeAtividade, strftime('%d/%m/%Y', DtCadastro) as DataCadastro, strftime('%d/%m/%Y', DtInicio) as DataInicio, 
                       strftime('%d/%m/%Y', DtFinal) as DataFinal
                       FROM Atividades 
                       WHERE DtCadastro >= '${dataDe}' AND DtCadastro <= '${dataAte}' AND Ativo = ${status} ORDER BY DtCadastro DESC`;

            instanceDB.all(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, "Atividade(s)"));
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "SelectByDate", err.message);
        }
    }


    ControleAtivo(idAtividade, status, res) {
        try {
            let sql = `UPDATE Atividades SET Ativo = ${status} WHERE Id = ${idAtividade}`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": 400, "message": err.message });
                else {
                    if (status == ATIVO)
                        res.json({ "status": 200, "message": "Atividade Reativada com Sucesso!" });
                    else
                        res.json({ "status": 200, "message": "Atividade Inativada com Sucesso!" });
                }
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "ControleAtivo", err.message);
        }
    }


    EditActivity(obj, res) {
        try {
            let sql = `UPDATE Projetos SET IdProjeto=${obj.idProjeto}, Nome='${obj.nome}', Descricao='${obj.descricao}', DtInicio='${obj.dtInicio}', DtFinal='${obj.dtFinal}', Finalizado=${obj.finalizado},
                       DtCadastro='${obj.dtCadastro}' WHERE Id=${obj.id}`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": 400, "message": err.message });
                else
                    res.json({ "status": 200, "message": "Atividade editada com sucesso!" });
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "EditActivity", err.message);
        }
    }

}
exports.AtividadesDAO = AtividadesDAO;