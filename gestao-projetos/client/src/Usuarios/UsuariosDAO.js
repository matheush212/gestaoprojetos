const singletonDB = require('singleton-db');
const instanceDB = singletonDB.Instance.getInstance();
const GetJSONDataSQL = require('../Functions/GetJSONDataSQL');
const Log = require("../Functions/GeraLog");
const bcrypt = require('bcryptjs');

class UsuariosDAO {
    SelectLogin(objUser, result) {
        try {
            let sql = `SELECT * FROM Usuarios WHERE (UPPER(Login) = '${objUser.login}') AND Ativo = 1`;
            var data = [];
            instanceDB.each(sql, [], (err, row) => {
                if (err) {
                    data.push({ "status": 400, "message": err.message });
                }

                if (row != null && row != "") {
                    if (bcrypt.compareSync(objUser.senha, row.Senha)) {
                        data.push({ "status": 200, "message": "Login efetuado com sucesso!", "data": row });
                    }
                    else {
                        data.push({ "status": 400, "message": "Senha incorreta" });
                    }
                }

            }, function () {
                result(data);
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "SelectLogin", err.message);
        }
    }


    CriaUsuario(objUser, res) {
        try {
            const passwordCrip = objUser.senha;
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(passwordCrip, salt);

            let sql = `INSERT INTO Usuarios(TipoUsuario, Nome, Login, Email, Senha, DtCadastro, Ativo) VALUES 
                       ('${objUser.tipoUsuario}', '${objUser.nome}', '${objUser.login}', '${objUser.email}', '${hash}', '${objUser.dtCadastro}', '${objUser.ativo}')`;
            instanceDB.run(sql, [], function (err) {
                if (err) {
                    if (err.errno == 19) {
                        res.json({ "status": 400, "message": "Este usuário ja existe! Por favor insira outro nome de usuário!" });
                    }
                    else {
                        res.json({ "status": 400, "message": "Não foi possível cadastrar o usuário '" + objUser.login + "'!" });
                    }
                }
                else {
                    res.json({ "status": 200, "message": "Usuário '" + objUser.login + "' cadastrado com sucesso!", });
                }
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "CriaUsuario", err.message);
        }
    }


    VerificaSenhaAtual(idUsuario, senhaAtual, novaSenha, res) {
        try {
            let sql = "SELECT * FROM Usuarios WHERE Id = ? AND Ativo = 1";
            let params = [idUsuario]
            instanceDB.get(sql, params, (err, row) => {
                if (err) {
                    res.json({ "status": 400, "message": err.message });
                }

                if (row != null && row != "") {
                    if (bcrypt.compareSync(senhaAtual, row.Senha))
                        this.AlteraSenha(idUsuario, novaSenha, res);
                    else {
                        res.json({ "status": 400, "message": "Senha Inválida!" });
                    }
                }
                else {
                    res.json({ "status": 400, "message": "Senha Inválida!" });
                }

            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "VerificaSenhaAtual", err.message);
        }
    }


    AlteraSenha(idUsuario, novaSenha, res) {
        try {
            const passwordCrip = novaSenha;
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(passwordCrip, salt);

            let sql = `UPDATE Usuarios SET Senha = '${hash}' WHERE Id = ${idUsuario}`;
            instanceDB.run(sql, [], function (err) {
                if (err) {
                    res.json({
                        "status": 400,
                        "message": "Não foi possível alterar a senha!"
                    });
                }
                else {
                    res.json({
                        "status": 200,
                        "message": "Senha alterada com sucesso!"
                    });
                }
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "AlteraSenha", err.message);
        }
    }


    GeraNovaSenha(login, novaSenha, res) {
        try {
            const passwordCrip = novaSenha;
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(passwordCrip, salt);

            let sql = `UPDATE Usuarios SET Senha = '${hash}' WHERE Login = '${login}'`;
            instanceDB.run(sql, [], function (err) {
                if (err) {
                    res.json({
                        "status": 400,
                        "message": "Não foi possível alterar a senha!"
                    });
                }
                else {
                    res.json({
                        "status": 200,
                        "message": "A sua senha foi alterada com sucesso!"
                    });
                }
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "GeraNovaSenha", err.message);
        }
    }


    SelectUserPerfil(idUsuario, res) {
        try {

            let sql = `SELECT Nome, Login, Email FROM Usuarios WHERE Id = ${idUsuario}`;
            instanceDB.get(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, 'Usuarios'));
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "SelectUserPerfil", err.message);
        }
    }


    SelectAllUsuarios(status, res) {
        try {
            let sql = `SELECT *, strftime('%d/%m/%Y', DtCadastro) as Data FROM Usuarios WHERE Ativo = ${status} ORDER BY DtCadastro DESC`;
            instanceDB.all(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, 'Usuarios'));
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "SelectAllUsuarios", err.message);
        }
    }


    SelectUsuariosByFilter(status, filtro, text, res) {
        try {
            let sql = `SELECT *, strftime('%d/%m/%Y', DtCadastro) as Data FROM Usuarios `;

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
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, "Usuario(s)"));
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "SelectUsuariosByFilter", err.message);
        }
    }


    SelectUsuariosByDate(status, dataDe, dataAte, res) {
        try {
            let sql = `SELECT *, strftime('%d/%m/%Y', DtCadastro) as Data FROM Usuarios 
                       WHERE DtCadastro >= '${dataDe}' AND DtCadastro <= '${dataAte}' AND Ativo = ${status} ORDER BY DtCadastro DESC`;

            instanceDB.all(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, "Usuario(s)"));
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "SelectUsuariosByDate", err.message);
        }
    }


    UpdateUsuarioAtivo(idUsuario, usuarioAtivoValue, res) {
        try {
            var data = [];
            let sql = `UPDATE Usuarios SET Ativo = ${usuarioAtivoValue} WHERE Id = ${idUsuario}`;
            instanceDB.run(sql, [], function (err) {
                if (err) {
                    res.json({ "status": 400, "message": err.message });
                }
                else {
                    res.json({ "status": 200 });
                }
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "UpdateUsuarioAtivo", err.message);
        }
    }


    UpdateUserPerfil(idUsuario, nome, login, email, res) {
        try {
            let sql = `UPDATE Usuarios SET Nome = '${nome}', Login = '${login}', Email = '${email}' WHERE Id = ${idUsuario}`;
            instanceDB.run(sql, [], function (err) {
                if (err) {
                    res.json({ "status": 400, "message": err.message });
                }
                else {
                    res.json({ "status": 200, "message": "Dados de perfil alterados com sucesso!" });
                }
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "UpdateUserPerfil", err.message);
        }
    }


    ResumoGeral(status, dataDe, dataAte, res) {
        try {
            let sql = `SELECT substr(DtCadastro, 1, 10) as 'DataCad', COUNT(Id) as 'Quantidade', strftime('%d/%m/%Y', DtCadastro) as Data FROM Usuarios
                       WHERE DtCadastro >= '${dataDe}' AND DtCadastro <= '${dataAte}' AND Ativo = ${status}
                       GROUP BY DataCad
                       ORDER BY DataCad DESC`;

            instanceDB.all(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, 'Usuarios'));
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "ResumoGeral", err.message);
        }
    }


    ResumoTotal(status, res) {
        try {
            let sql = `SELECT COUNT(Id) as 'Quantidade' FROM Usuarios WHERE Ativo = ${status}`;

            instanceDB.all(sql, [], (err, rows) => {
                res.json(GetJSONDataSQL.ReturnDataJSON(err, rows, 'Usuarios'));
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "ResumoTotal", err.message);
        }
    }


    ControleAtivo(idUsuario, status, res) {
        try {
            let sql = `UPDATE Usuarios SET Ativo = ${status} WHERE Id = ${idUsuario}`;

            instanceDB.run(sql, [], function (err) {
                if (err) 
                    res.json({ "status": 400, "message": err.message });
                else {
                    if(status == 1)
                        res.json({ "status": 200, "message": "Usuário Ativado com Sucesso!"});
                    else 
                        res.json({ "status": 200, "message": "Usuário Inativado com Sucesso!"});
                }
            });
        }
        catch (err) {
            Log.LogError("UsuarioDAO", "ControleAtivo", err.message);
        }
    }
}
exports.UsuariosDAO = UsuariosDAO;