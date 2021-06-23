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