const singletonDB = require('singleton-db');
const instanceDB = singletonDB.Instance.getInstance();
const GetJSONDataSQL = require('../Functions/GetJSONDataSQL');
const Log = require("../Functions/GeraLog");
const CalculaPorcentagem = require("../Functions/CalculaPorcentagem");
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
                if (err)
                    res.json({ "status": 404, "message": err.message });

                if (rows != null && rows != "")
                    this.SelectActivities(idProjeto, rows, res);
                else
                    res.json({ "status": 400, "message": "Projeto não encontrado!" });
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "SelectByID", err.message);
        }
    }


    SelectActivities(idProjeto, projectRows, res) {
        try {
            let sql = `SELECT Count(Id) as Total, 
                       (SELECT Count(Id) FROM Atividades WHERE IdProjeto = ${idProjeto} AND Finalizado = 1 AND Ativo = 1) 
                       as Finalizados
                       FROM Atividades 
                       WHERE IdProjeto = ${idProjeto} AND Ativo = 1`;

            instanceDB.get(sql, [], (err, rows) => {
                if (err)
                    res.json({ "status": 200, "message": "Projeto editado com sucesso!" });
                else
                    this.UdatePercent(idProjeto, projectRows, CalculaPorcentagem.CalculaPorcentagens(rows.Total, rows.Finalizados), res);
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "SelectActivities", err.message);
        }
    }


    UdatePercent(idProjeto, rows, porcentagem, res) {
        try {

            if (Number(porcentagem) == -99)
                res.json({ "status": 200, "data": rows, "percent": -99 });
            else {
                let sql = `UPDATE Projetos SET Porcentagem=${porcentagem} WHERE Id=${idProjeto}`;

                instanceDB.run(sql, [], function (err) {
                    res.json({ "status": 200, "data": rows, "percent": porcentagem });
                });
            }
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "UdatePercent", err.message);
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

                console.log(sql);

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

            instanceDB.run(sql, [], (err) => {
                if (err)
                    res.json({ "status": 400, "message": err.message });
                else
                    this.SelectCountAtividades(obj.id, res);
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "EditProject", err.message);
        }
    }


    SelectCountAtividades(idProjeto, res) {
        try {
            let sql = `SELECT Count(Id) as Total, 
                       (SELECT Count(Id) FROM Atividades WHERE IdProjeto = ${idProjeto} AND Finalizado = 1 AND Ativo = 1) 
                       as Finalizados
                       FROM Atividades 
                       WHERE IdProjeto = ${idProjeto} AND Ativo = 1`;

            instanceDB.get(sql, [], (err, rows) => {
                if (err)
                    res.json({ "status": 200, "message": "Projeto editado com sucesso!" });
                else
                    this.AtualizaPorcentegem(idProjeto, CalculaPorcentagem.CalculaPorcentagens(rows.Total, rows.Finalizados), res);
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "SelectCountAtividades", err.message);
        }
    }


    AtualizaPorcentegem(idProjeto, porcentagem, res) {
        try {

            if (Number(porcentagem) == -99)
                res.json({ "status": 200, "message": "Projeto editado com sucesso!" });
            else {
                let sql = `UPDATE Projetos SET Porcentagem=${porcentagem} WHERE Id=${idProjeto}`;

                instanceDB.run(sql, [], function (err) {
                    res.json({ "status": 200, "message": "Projeto editado com sucesso!" });
                });
            }
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "AtualizaPorcentegem", err.message);
        }
    }


    RemoveAtividade(idProjeto, res) {
        try {
            let sql = `DELETE FROM Atividades WHERE IdProjeto=${idProjeto}`;

            instanceDB.run(sql, [], (err) => {
                if (err)
                    res.json({ "status": 404, "message": err.message });
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
                    res.json({ "status": 404, "message": err.message });
                else
                    res.json({ "status": 200, "message": "Projeto excluído com sucesso!" });
            });
        }
        catch (err) {
            Log.LogError("ProjetosDAO", "RemoveProjeto", err.message);
        }
    }

}
exports.ProjetosDAO = ProjetosDAO;