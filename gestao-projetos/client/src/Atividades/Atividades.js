class Atividades{
    constructor(id, idProjeto, nome, descricao, dtInicio, dtFinal, porcentagem, atrasado, finalizado, dtCadastro, ativo){
        this.id = id;
        this.idProjeto = idProjeto;
        this.nome = nome;
        this.descricao = descricao;
        this.dtInicio = dtInicio;
        this.dtFinal = dtFinal;
        this.porcentagem = porcentagem;
        this.atrasado = atrasado;
        this.finalizado = finalizado;
        this.dtCadastro = dtCadastro;
        this.ativo = ativo;
    }
}
exports.Atividades = Atividades;
