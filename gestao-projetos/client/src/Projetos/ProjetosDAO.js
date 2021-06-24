const singletonDB = require('singleton-db');
const instanceDB = singletonDB.Instance.getInstance();
const GetJSONDataSQL = require('../Functions/GetJSONDataSQL');
const Log = require("../Functions/GeraLog");
const CalculaPorcentagem = require("../Functions/CalculaPorcentagem");
const ATIVO = 1;
const COD_ERRO = -99;
const STATUS_200 = 200;
const STATUS_400 = 400;
const STATUS_404 = 404;

class ProjetosDAO {
    NewProject(obj, res) {
        try {
            let sql = `INSERT INTO Projetos(Nome, Descricao, DtInicio, DtFinal, Porcentagem, Atrasado, Finalizado, DtCadastro, Ativo) VALUES 
                       ('${obj.nome}', '${obj.descricao}', '${obj.dtInicio}', '${obj.dtFinal}', ${obj.porcentagem}, ${obj.atrasado}, ${obj.finalizado}, 
                       '${obj.dtCadastro}', ${obj.ativo})`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": STATUS_400, "message": "Não foi possível cadastrar o projeto '" + objUser.nome + "'!" });
                else
                    res.json({ "status": STATUS_200, "message": "Projeto '" + obj.nome + "' cadastrado com sucesso!" });
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
                if (err)
                    res.json({ "status": STATUS_404, "message": err.message });

                if (rows != null && rows != "")
                    this.SelectActivities(idProjeto, rows, res);
                else
                    res.json({ "status": STATUS_400, "message": "Projeto não encontrado!" });
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "SelectByID", err.message);
        }
    }


    SelectActivities(idProjeto, projectRows, res) {
        try {
            let sql = `SELECT Count(Id) as Total, Max(DtFinal) as DtFinalAtividade, 
                       (SELECT Count(Id) FROM Atividades WHERE IdProjeto = ${idProjeto} AND Finalizado = 1 AND Ativo = 1) 
                       as Finalizados
                       FROM Atividades 
                       WHERE IdProjeto = ${idProjeto} AND Ativo = 1`;

            instanceDB.get(sql, [], (err, rows) => {
                if (err)
                    res.json({ "status": STATUS_200, "data": projectRows, "percent": COD_ERRO, "atrasado": COD_ERRO });
                else
                    this.UdatePercent(idProjeto, projectRows, CalculaPorcentagem.CalculaPorcentagens(rows.Total, rows.Finalizados), rows.DtFinalAtividade, res);
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "SelectActivities", err.message);
        }
    }


    UdatePercent(idProjeto, projectRows, porcentagem, dtFinalAtividade, res) {
        try {
            if (Number(porcentagem) == COD_ERRO)
                res.json({ "status": STATUS_200, "data": projectRows, "percent": COD_ERRO, "atrasado": COD_ERRO });
            else {
                let sql = `UPDATE Projetos SET Porcentagem=${porcentagem} WHERE Id=${idProjeto}`;

                instanceDB.run(sql, [], (err) => {
                    if (err)
                        res.json({ "status": STATUS_200, "data": projectRows, "percent": COD_ERRO, "atrasado": COD_ERRO });
                    else
                        this.UdateSituacao(idProjeto, projectRows, porcentagem, dtFinalAtividade, res);
                });
            }
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "UdatePercent", err.message);
        }
    }


    UdateSituacao(idProjeto, projectRows, porcentagem, dtFinalAtividade, res) {
        try {
            let atrasado = 0;
            let maiorDataFinalAtividade = new Date(dtFinalAtividade);
            let dataFinalProjeto = new Date(projectRows.DtFinal);

            if (maiorDataFinalAtividade > dataFinalProjeto)
                atrasado = 1;
            else
                atrasado = 0;

            let sql = `UPDATE Projetos SET Atrasado=${atrasado} WHERE Id=${idProjeto}`;
            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": STATUS_200, "data": projectRows, "percent": porcentagem, "atrasado": COD_ERRO });
                else
                    res.json({ "status": STATUS_200, "data": projectRows, "percent": porcentagem, "atrasado": atrasado });
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "UdateSituacao", err.message);
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


    SelectByFilter(filters, res) {
        try {
            let groupLength = filters.length;

            if (groupLength > 0) {
                let sql = `SELECT *, substr(Nome, 0, 40) as NomeProjeto, strftime('%d/%m/%Y', DtCadastro) as DataCadastro, strftime('%d/%m/%Y', DtInicio) as DataInicio, 
                       strftime('%d/%m/%Y', DtFinal) as DataFinal
                       FROM Projetos WHERE `;

                for (let i = 0; i < groupLength; i++) {
                    if ((i + 1) != (groupLength))
                        sql += `${filters[i].key} ${filters[i].operator} '${filters[i].value}' AND `;
                    else
                        sql += `${filters[i].key} ${filters[i].operator} '${filters[i].value}'`;
                }

                instanceDB.all(sql, [], (err, rows) => {
                    res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, "Projeto(s)"));
                });
            }
            else
                this.SelectAll(1, res);
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "SelectByFilter", err.message);
        }
    }


    ControleAtivo(idProjeto, status, res) {
        try {
            let sql = `UPDATE Projetos SET Ativo = ${status} WHERE Id = ${idProjeto}`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": STATUS_400, "message": err.message });
                else {
                    if (status == ATIVO)
                        res.json({ "status": STATUS_200, "message": "Projeto Reativado com Sucesso!" });
                    else
                        res.json({ "status": STATUS_200, "message": "Projeto Inativado com Sucesso!" });
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

            instanceDB.run(sql, [], (err) => {
                if (err)
                    res.json({ "status": STATUS_400, "message": err.message });
                else
                    res.json({ "status": STATUS_200, "message": "Projeto editado com sucesso!" });
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "EditProject", err.message);
        }
    }


    RemoveAtividade(idProjeto, res) {
        try {
            let sql = `DELETE FROM Atividades WHERE IdProjeto=${idProjeto}`;

            instanceDB.run(sql, [], (err) => {
                if (err)
                    res.json({ "status": STATUS_404, "message": err.message });
                else
                    this.RemoveProjeto(idProjeto, res);
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "RemoveAtividade", err.message);
        }
    }


    RemoveProjeto(idProjeto, res) {
        try {
            let sql = `DELETE FROM Projetos WHERE Id=${idProjeto}`;

            instanceDB.run(sql, [], function (err) {
                if (err)
                    res.json({ "status": STATUS_404, "message": err.message });
                else
                    res.json({ "status": STATUS_200, "message": "Projeto excluído com sucesso!" });
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "RemoveProjeto", err.message);
        }
    }


    SelectInfo(res) {
        try {
            let sql = `SELECT
                       (SELECT COUNT(Id) FROM Projetos WHERE Ativo = 1) as TotalProjetos,
                       (SELECT COUNT(Id) FROM Atividades WHERE Ativo = 1) as TotalAtividades,
                       (SELECT COUNT(Id) FROM Projetos WHERE Finalizado = 1 AND Ativo = 1) as ProjetosConcluidos, 
                       (SELECT COUNT(Id) FROM Projetos WHERE Finalizado = 0 AND Ativo = 1) as ProjetosEmAndamento,
                       (SELECT COUNT(Id) FROM Atividades WHERE Finalizado = 1 AND Ativo = 1) as AtividadesConcluidas,
                       (SELECT COUNT(Id) FROM Atividades WHERE Finalizado = 0 AND Ativo = 1) as AtividadesEmAndamento,
                       (SELECT COUNT(Id) FROM Projetos WHERE Atrasado = 1 AND Finalizado = 0 AND Ativo = 1) as ProjetosAtrasados,
                       (SELECT COUNT(Id) FROM Atividades WHERE Atrasado = 1 AND Finalizado = 0 AND Ativo = 1) as AtividadesAtrasadas,
                       (SELECT Min(DtInicio) FROM Atividades WHERE Ativo = 1) as DtInicialAtividades,
                       (SELECT Max(DtFinal) FROM Atividades WHERE Ativo = 1) as DtFinalMaximaAtividades
                       FROM Projetos Limit 1`;

            instanceDB.all(sql, [], (err, rows) => {
                if (err)
                    res.json({ "status": STATUS_404, "message": err.message });

                if (rows != null && rows != "")
                    this.CalculaHorasTrabalhadas(rows, res);
                else
                    res.json({ "status": STATUS_400, "message": "Informações não encontradas!" });
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "SelectInfo", err.message);
        }
    }


    CalculaHorasTrabalhadas(rows, res) {
        try {
            let dtInicio = new Date(rows[0].DtInicialAtividades);
            let dtFinal = new Date(rows[0].DtFinalMaximaAtividades);
            let hours = Math.abs(dtFinal - dtInicio) / 36e5;
            res.json({ "status": STATUS_200, "message": 'Informações carregadas com sucesso', "data": rows, "hours": hours });

        }
        catch (err) {
            Log.LogError("ProjetosDAO", "CalculaHorasTrabalhadas", err.message);
            res.json({ "status": STATUS_404, "message": err.message });
        }
    }
}
exports.ProjetosDAO = ProjetosDAO;