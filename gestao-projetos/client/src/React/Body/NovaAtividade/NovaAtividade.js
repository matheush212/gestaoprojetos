import React from 'react';
import './NovaAtividade.css';
import 'materialize-css/dist/css/materialize.min.css';
import ApiService from '../../Utils/ApiService';
import PopUp from '../../Utils/PopUp';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import UrlParam from '../../../Functions/GetUrlParameters';
import GetDate from '../../../Functions/GetCurrentDate';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import StyleControl from '../../../Functions/ControleCSSBotoes';
import AccountTreeTwoToneIcon from '@material-ui/icons/AccountTreeTwoTone';
import { ClearField, ConfigControl } from '../../../Functions/ConfigTextFieldList';
import HourglassFullTwoToneIcon from '@material-ui/icons/HourglassFullTwoTone';
import AssessmentTwoToneIcon from '@material-ui/icons/AssessmentTwoTone';
import AutenticacaoSession from '../../../Autenticacao/AutenticacaoSession';
import Log from '../../../Functions/GeraLog';
let idProjeto = '', nome = '', descricao = '', dtInicio = '', dtFinal = '';
let tokenRef = UrlParam.queryString("Ref");
let projectID = UrlParam.queryString("IdProjeto");
const STATUS_200 = 200;
const STATUS_400 = 400;
const ATIVOS = 1;


class NovaAtividade extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openDialog: false,
            dialogText: '',
            anchorEl: null,
            projetos: []
        }
    }


    componentDidMount() {
        StyleControl.CSSBotoes("BtnNovaAtividade", window.screen.width, window.screen.height);
        document.getElementById("div-after-end").style.setProperty('display', 'flex', 'important');
        this.GetAllProjects();
    }


    GetAllProjects = () => {
        ApiService.AllProjects(ATIVOS, tokenRef).then(res => {
            this.setState({ projetos: [] });
            if (res.status === STATUS_200)
                this.setState({ projetos: [...this.state.projetos, ...res.data] });
            else if (res.status === STATUS_400)
                PopUp.ExibeMensagem('info', res.message);
            else {
                PopUp.ExibeMensagem('error', "Não foi possível carregar os projetos");
                Log.LogError("NovaAtividade", "GetAllProjects", res.message);
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', 'Falha na comunicação com a API ao listar os projetos');
            Log.LogError("NovaAtividade", "GetAllProjects", err.message);
        });
    }


    ValidaCamposNulos = () => {
        try {
            let campoNulo = "";

            if (document.getElementById("TipoProjeto").value !== "") {
                if (document.getElementById("NomeAtividade").value !== "") {
                    if (document.getElementById("DtInicioAtividade").value !== "") {
                        if (document.getElementById("DtFinalAtividade").value !== "") {
                            campoNulo = "";
                        }
                        else campoNulo = "Data Final";
                    }
                    else campoNulo = "Data Início";
                }
                else campoNulo = "Nome da Atividade";
            }
            else campoNulo = "Projeto";

            if (campoNulo !== "")
                PopUp.ExibeMensagem('info', "O campo '" + campoNulo + "' não pode ser nulo!");
            else {
                this.handleOpen();
            }
        }
        catch (err) {
            Log.LogError("NovaAtividade", "ValidaCamposNulos", err.message);
        }
    }


    handleOpen = () => {
        this.setState({
            openDialog: true,
            dialogText: "Você deseja realmente cadastrar a atividade '" + document.getElementById("NomeAtividade").value + "'?"
        });
    };


    handleClose = () => {
        this.setState({ openDialog: false });
    };


    handleConfirm = () => {
        this.setState({ openDialog: false });
        this.CadastraAtividade();
    }


    CadastraAtividade = () => {
        if (AutenticacaoSession.Authorize()) {
            this.GetDadosAtividade();

            fetch('http://' + window.location.hostname + ':5000/api/sgp/new/activity', {
                method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "idProjeto": idProjeto, "nome": nome, "descricao": descricao, "dtInicio": dtInicio,
                    "dtFinal": dtFinal, "dtCadastro": GetDate.ReturnCurrentDate(), "token": tokenRef,
                })
            }).then((response) => response.json()).then((res) => {
                if (res.status === 200) {
                    PopUp.ExibeMensagem('success', res.message);
                    this.LimpaCampos();
                    this.ResetVariaveis();
                }
                else {
                    PopUp.ExibeMensagem('error', "Não foi possível cadastrar a Atividade!");
                    Log.LogError("NovaAtividade", "CadastraAtividade", res.message);
                }
            }).catch(err => {
                PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
                Log.LogError("NovaAtividade", "CadastraAtividade", err.message);
            });
        }
        else
            PopUp.ExibeMensagem('error', "Autorização Negada!");
    }


    GetDadosAtividade = () => {
        try {
            let projetoVal = document.getElementById("TipoProjeto").value;
            idProjeto = document.querySelector("#projetos option[value='" + projetoVal + "']").dataset.value;

            nome = document.getElementById("NomeAtividade").value;
            descricao = "Descrição: \n\n" + document.getElementById("DescAtividade").value;
            dtInicio = document.getElementById("DtInicioAtividade").value;
            dtFinal = document.getElementById("DtFinalAtividade").value;
        }
        catch (err) {
            Log.LogError("NovaAtividade", "GetDadosAtividade", err.message);
        }
    }


    LimpaCampos = () => {
        document.getElementById("NomeAtividade").value = "";
        document.getElementById("DescAtividade").value = "";
        document.getElementById("DtInicioAtividade").value = "";
        document.getElementById("DtFinalAtividade").value = "";
    }


    ResetVariaveis = () => {
        nome = "";
        descricao = "";
        dtInicio = "";
        dtFinal = "";
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
        window.location.href = "MinhasAtividades?Ref=" + tokenRef + "&IdProjeto=" + projectID;
    }


    render() {
        return (
            <div className="body-nova-atividade">
                <Dialog open={this.state.openDialog} onClose={this.handleClose} aria-labelledby="draggable-dialog-title">
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Cadastro!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.dialogText}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button className="dialog-padrao" onClick={this.handleConfirm} color="primary">Sim</Button>
                        <Button className="dialog-padrao" onClick={this.handleClose} color="primary">Não</Button>
                    </DialogActions>
                </Dialog>
                <div className="menu-superior">
                    <AccountTreeTwoToneIcon className="icons-menu" color="primary" onClick={this.GoToMeusProjetos} />
                    <Button className="buttons-menu" onClick={this.GoToMeusProjetos}>Meus Projetos</Button>
                    <HourglassFullTwoToneIcon className="icons-menu" style={{ marginLeft: '1em' }} color="primary" />
                    <Button className="buttons-menu" >Tempo Gasto Geral</Button>
                    <AssessmentTwoToneIcon className="icons-menu" style={{ marginLeft: '1em' }} color="primary" />
                    <Button className="buttons-menu">Gráficos</Button>
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
                                <TextField type="text" autoFocus helperText="Projeto" id="TipoProjeto" onFocus={() => ClearField("TipoProjeto")} onBlur={() => ConfigControl("TipoProjeto")} inputProps={{ list: "projetos" }} className="half-inputs-padrao" placeholder="Projeto *" />
                                <datalist id="projetos">
                                    {this.state.projetos.map((row, index) => {
                                        return (<option key={index} data-value={String(row.Id)} value={row.Nome} />);
                                    })}
                                </datalist>
                                <TextField type="text" helperText="Nome da Atividade" id="NomeAtividade" style={{ marginLeft: '10%' }} className="half-inputs-padrao" placeholder="Nome *" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <textarea id="DescAtividade" className="textarea-atividade" placeholder="Descrição"></textarea>
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="date" helperText="Data Início" id="DtInicioAtividade" className="inputs-padrao" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="date" helperText="Data Final" id="DtFinalAtividade" className="inputs-padrao" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao" />
                            <div className="div-inputs-padrao">
                                <Button className="button-style-padrao" onClick={this.ValidaCamposNulos}>Cadastrar</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Button id="BtnNovaAtividade" className="btn-padrao" onClick={this.Voltar}>Voltar</Button>
                <div id="div-after-end"></div>
            </div>
        )
    }
}
export default NovaAtividade;