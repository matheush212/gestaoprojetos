import React from 'react';
import './Informacoes.css';
import 'materialize-css/dist/css/materialize.min.css';
import ApiService from '../../Utils/ApiService';
import PopUp from '../../Utils/PopUp';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import UrlParam from '../../../Functions/GetUrlParameters';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import StyleControl from '../../../Functions/ControleCSSBotoes';
import CalculaPorcentagem from '../../../Functions/CalculaPorcentagem';
import AccountTreeTwoToneIcon from '@material-ui/icons/AccountTreeTwoTone';
import Log from '../../../Functions/GeraLog';
let tokenRef = UrlParam.queryString("Ref");
const STATUS_200 = 200;
const STATUS_400 = 400;


class Informacoes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openDialog: false,
            dialogText: '',
            anchorEl: null
        }
    }


    componentDidMount() {
        StyleControl.CSSBotoes("BtnInformacoes", window.screen.width, window.screen.height);
        document.getElementById("div-after-end").style.setProperty('display', 'flex', 'important');
        this.GetInformacoes();
    }


    GetInformacoes = () => {
        ApiService.Informacoes(tokenRef).then(res => {
            if (res.status === STATUS_200)
                this.PreencheInformacoes(res.data[0], res.hours);
            else if (res.status === STATUS_400)
                PopUp.ExibeMensagem('info', res.message);
            else {
                PopUp.ExibeMensagem('error', "Não foi possível encontrar as informações");
                Log.LogError("Informacoes", "GetInformacoes", res.message);
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', 'Falha na comunicação com a API');
            Log.LogError("Informacoes", "GetInformacoes", err.message);
        });
    }



    PreencheInformacoes = (dados, horas) => {
        document.getElementById("HorasTrabalhadas").value = horas;
        document.getElementById("ProjetosConcluidos").value = dados.ProjetosConcluidos;
        document.getElementById("ProjetosAndamento").value = dados.ProjetosEmAndamento;
        document.getElementById("AtividadesConcluidas").value = dados.AtividadesConcluidas;
        document.getElementById("AtividadesAndamento").value = dados.AtividadesEmAndamento;
        document.getElementById("ProjetosAtrasados").value = dados.ProjetosAtrasados;
        document.getElementById("AtividadesAtrasadas").value = dados.AtividadesAtrasadas;
        document.getElementById("ProjetosConcluidosP").value = CalculaPorcentagem.CalculaPorcentagens(dados.TotalProjetos, dados.ProjetosConcluidos) + "%";
        document.getElementById("ProjetosAndamentoP").value = CalculaPorcentagem.CalculaPorcentagens(dados.TotalAtividades, dados.AtividadesConcluidas) + "%";
    }



    OpenMenuBar = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    }


    CloseMenuBar = (action) => {
        this.setState({ anchorEl: null });

        if (action === "Perfil")
            window.location.href = "AlteraPerfil?Ref=" + tokenRef;
        else if (action === "TrocaSenha")
            window.location.href = "AlteraSenha?Ref=" + tokenRef;
    }


    GoToMeusProjetos = () => {
        window.location.href = "MeusProjetos?Ref=" + tokenRef;
    }


    Voltar = () => {
        window.location.href = "MeusProjetos?Ref=" + tokenRef;
    }


    render() {
        return (
            <div className="body-novo-projeto">
                <div className="menu-superior">
                    <AccountTreeTwoToneIcon className="icons-menu" color="primary" onClick={this.GoToMeusProjetos} />
                    <Button className="buttons-menu" onClick={this.GoToMeusProjetos}>Meus Projetos</Button>
                    <div className="box-perfil" aria-controls="simple-menu" aria-haspopup="true" onMouseOver={this.OpenMenuBar}>E</div>
                    <Menu id="simple-menu" anchorEl={this.state.anchorEl} keepMounted open={Boolean(this.state.anchorEl)} onClose={this.CloseMenuBar}>
                        <div className="user-info">Euax</div>
                        <MenuItem onClick={() => this.CloseMenuBar("Perfil")}>Perfil</MenuItem>
                        <MenuItem onClick={() => this.CloseMenuBar("TrocaSenha")}>Trocar Senha</MenuItem>
                    </Menu>
                </div>
                <div className="container">
                    <div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao" style={{ marginTop: '10px' }}>
                                <TextField type="text" inputProps={{readOnly: true}} helperText="Horas Trabalhadas" id="HorasTrabalhadas" className="inputs-padrao" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="text" inputProps={{readOnly: true}} helperText="Projetos Concluídos" id="ProjetosConcluidos" className="half-inputs-padrao" />
                                <TextField type="text" inputProps={{readOnly: true}} helperText="Projetos em Andamento" id="ProjetosAndamento" style={{ marginLeft: '10%' }} className="half-inputs-padrao" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="text" inputProps={{readOnly: true}} helperText="Atividades Concluídas" id="AtividadesConcluidas" className="half-inputs-padrao" />
                                <TextField type="text" inputProps={{readOnly: true}} helperText="Atividades em Andamento" id="AtividadesAndamento" style={{ marginLeft: '10%' }} className="half-inputs-padrao" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="text" inputProps={{readOnly: true}} helperText="Projetos Atrasados" id="ProjetosAtrasados" className="half-inputs-padrao" />
                                <TextField type="text" inputProps={{readOnly: true}} helperText="Atividades Atrasadas" id="AtividadesAtrasadas" style={{ marginLeft: '10%' }} className="half-inputs-padrao" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="text" inputProps={{readOnly: true}} helperText="Projetos Finalizados (%)" id="ProjetosConcluidosP" className="half-inputs-padrao" />
                                <TextField type="text" inputProps={{readOnly: true}} helperText="Projetos em Andemento (%)" id="ProjetosAndamentoP" style={{ marginLeft: '10%' }} className="half-inputs-padrao" />
                            </div>
                        </div>
                    </div>
                </div>
                <Button id="BtnInformacoes" className="btn-padrao" onClick={this.Voltar}>Voltar</Button>
                <div id="div-after-end"></div>
            </div>
        )
    }
}
export default Informacoes;