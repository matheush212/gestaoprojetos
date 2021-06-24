const singletonDB = require('singleton-db');
const instanceDB = singletonDB.Instance.getInstance();
const GetJSONDataSQL = require('../Functions/GetJSONDataSQL');
const Log = require("../Functions/GeraLog");
const CalculaPorcentagem = require("../Functions/CalculaPorcentagem");
const ATIVO = 1;
const STATUS_200 = 200;
const STATUS_400 = 400;
const STATUS_404 = 404;
const COD_ERRO = -99;

class AtividadesDAO {
    NewActivity(obj, res) {
        try {
            let sql = `INSERT INTO Atividades(IdProjeto, Nome, Descricao, DtInicio, DtFinal, Porcentagem, Atrasado, Finalizado, DtCadastro, Ativo) VALUES 
                       (${obj.idProjeto}, '${obj.nome}', '${obj.descricao}', '${obj.dtInicio}', '${obj.dtFinal}', ${obj.porcentagem}, ${obj.atrasado}, ${obj.finalizado}, 
                       '${obj.dtCadastro}', ${obj.ativo})`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": STATUS_400, "message": "Não foi possível cadastrar a atividade '" + objUser.login + "'!" });
                else
                    res.json({ "status": STATUS_200, "message": "Atividade '" + obj.nome + "' cadastrada com sucesso!" });
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "NewActivity", err.message);
        }
    }


    SelectByID(idAtividade, res) {
        try {
            let sql = `SELECT Atividades.*, Projetos.Nome as NomeProjeto
                       FROM Atividades 
                       INNER JOIN Projetos ON (Projetos.Id = Atividades.IdProjeto)
                       WHERE Atividades.Id = ${idAtividade} AND Atividades.Ativo = 1`;

            instanceDB.get(sql, [], (err, rows) => {
                if (err)
                    res.json({ "status": STATUS_404, "message": err.message });

                if (rows != null && rows != "")
                    this.UpdatePercent(idAtividade, rows, CalculaPorcentagem.GetDiferencaEmDias(rows.DtInicio, rows.DtFinal), res);
                else
                    res.json({ "status": STATUS_400, "message": "Atividade não encontrada!" });
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "SelectByID", err.message);
        }
    }


    UpdatePercent(idAtividade, projectRows, porcentagem, res) {
        try {

            if (Number(porcentagem) == COD_ERRO)
                res.json({ "status": STATUS_200, "data": projectRows, "percent": COD_ERRO, "atrasado": COD_ERRO });
            else {
                let sql = `UPDATE Atividades SET Porcentagem=${porcentagem} WHERE Id=${idAtividade}`;

                instanceDB.run(sql, [], (err) => {
                    if (err)
                        res.json({ "status": STATUS_200, "data": projectRows, "percent": COD_ERRO, "atrasado": COD_ERRO });
                    else
                        this.UdateSituacao(idAtividade, projectRows, porcentagem, res);
                });
            }
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "UpdatePercent", err.message);
        }
    }


    UdateSituacao(idAtividade, projectRows, porcentagem, res) {
        try {
            let atrasado = 0;
            let dataAtual = new Date();
            let dataFinalAtividade = new Date(projectRows.DtFinal);

            if (dataAtual > dataFinalAtividade)
                atrasado = 1;
            else
                atrasado = 0;

            let sql = `UPDATE Atividades SET Atrasado=${atrasado} WHERE Id=${idAtividade}`;
            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": STATUS_200, "data": projectRows, "percent": porcentagem, "atrasado": COD_ERRO });
                else
                    res.json({ "status": STATUS_200, "data": projectRows, "percent": porcentagem, "atrasado": atrasado });
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "UdateSituacao", err.message);
        }
    }


    SelectAll(idProjeto, status, res) {
        try {
            let sql = `SELECT Atividades.*, substr(Atividades.Nome, 0, 40) as NomeAtividade, strftime('%d/%m/%Y', Atividades.DtCadastro) as DataCadastro, 
                       strftime('%d/%m/%Y', Atividades.DtInicio) as DataInicio, strftime('%d/%m/%Y', Atividades.DtFinal) as DataFinal,
                       Projetos.Nome as NomeProjeto
                       FROM Atividades 
                       INNER JOIN Projetos ON (Projetos.Id = Atividades.IdProjeto)
                       WHERE Atividades.IdProjeto = ${idProjeto} AND Atividades.Ativo = ${status} 
                       ORDER BY Atividades.DtCadastro DESC`;

            instanceDB.all(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, 'Atividades'));
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "SelectAll", err.message);
        }
    }


    SelectByFilter(idProjeto, filters, res) {
        try {
            let groupLength = filters.length;

            if (groupLength > 0) {
                let sql = `SELECT Atividades.*, substr(Atividades.Nome, 0, 40) as NomeAtividade, strftime('%d/%m/%Y', Atividades.DtCadastro) as DataCadastro, 
                           strftime('%d/%m/%Y', Atividades.DtInicio) as DataInicio, strftime('%d/%m/%Y', Atividades.DtFinal) as DataFinal,
                           Projetos.Nome as NomeProjeto
                           FROM Atividades 
                           INNER JOIN Projetos ON (Projetos.Id = Atividades.IdProjeto) WHERE Atividades.IdProjeto = ${idProjeto} AND `;

                for (let i = 0; i < groupLength; i++) {
                    if ((i + 1) != (groupLength))
                        sql += `Atividades.${filters[i].key} ${filters[i].operator} '${filters[i].value}' AND `;
                    else
                        sql += `Atividades.${filters[i].key} ${filters[i].operator} '${filters[i].value}'`;
                }

                instanceDB.all(sql, [], (err, rows) => {
                    res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, "Atividade(s)"));
                });
            }
            else
                this.SelectAll(idProjeto, 1, res);
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "SelectByFilter", err.message);
        }
    }


    ControleAtivo(idAtividade, status, res) {
        try {
            let sql = `UPDATE Atividades SET Ativo = ${status} WHERE Id = ${idAtividade}`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": STATUS_400, "message": err.message });
                else {
                    if (status == ATIVO)
                        res.json({ "status": STATUS_200, "message": "Atividade Reativada com Sucesso!" });
                    else
                        res.json({ "status": STATUS_200, "message": "Atividade Inativada com Sucesso!" });
                }
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "ControleAtivo", err.message);
        }
    }


    EditActivity(obj, res) {
        try {
            let sql = `UPDATE Atividades SET IdProjeto=${obj.idProjeto}, Nome='${obj.nome}', Descricao='${obj.descricao}', DtInicio='${obj.dtInicio}', DtFinal='${obj.dtFinal}', Finalizado=${obj.finalizado},
                       DtCadastro='${obj.dtCadastro}' WHERE Id=${obj.id}`;

            instanceDB.run(sql, [], (err) => {
                if (err)
                    res.json({ "status": STATUS_400, "message": err.message });
                else
                    res.json({ "status": STATUS_200, "message": "Atividade editada com sucesso!" });
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "EditActivity", err.message);
        }
    }


    RemoveAtividade(idAtividade, res) {
        try {
            let sql = `DELETE FROM Atividades WHERE Id=${idAtividade}`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": STATUS_404, "message": err.message });
                else
                    res.json({ "status": STATUS_200, "message": "Atividade excluída com sucesso!" });
            });
        }
        catch (err) {
            Log.LogError("AtividadesDAO", "RemoveAtividade", err.message);
        }
    }

}
exports.AtividadesDAO = AtividadesDAO;