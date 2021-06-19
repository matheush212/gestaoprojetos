class Usuarios{
    constructor(id, tipoUsuario, nome, login, senha, dtCadastro, ativo){
        this.id = id;
        this.tipoUsuario = tipoUsuario;
        this.nome = nome;
        this.login = login;
        this.senha = senha;
        this.dtCadastro = dtCadastro;
        this.ativo = ativo;
    }
}
exports.Usuarios = Usuarios;
