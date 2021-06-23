import React from 'react';
import './VisualizaProjeto.css';
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
import AccountTreeTwoToneIcon from '@material-ui/icons/AccountTreeTwoTone';
import HourglassFullTwoToneIcon from '@material-ui/icons/HourglassFullTwoTone';
import AssessmentTwoToneIcon from '@material-ui/icons/AssessmentTwoTone';
import AssignmentTurnedInTwoToneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ClearField, ConfigControl } from '../../../Functions/ConfigTextFieldList';
import StyleControl from '../../../Functions/ControleCSSBotoes';
import AutenticacaoSession from '../../../Autenticacao/AutenticacaoSession';
import Log from '../../../Functions/GeraLog';
let nome = '', descricao = '', dtInicio = '', dtFinal = '', finalizado = '', dtCadastro = '';
let tokenRef = UrlParam.queryString("Ref");
let idProjeto = UrlParam.queryString("IdProjeto");
const STATUS_200 = 200;
const STATUS_400 = 400;
const INATIVA = 0;


class VisualizaProjeto extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openDialog: false,
            dialogText: '',
            anchorEl: null,
            openBoxInativaProjeto: false,
            openBoxExcluiProjeto: false
        }
    }


    componentDidMount() {
        StyleControl.CSSBotoes("BtnVoltarProjeto", window.screen.width, window.screen.height);
        StyleControl.CSSBotoes("BtnInativaProjeto", window.screen.width, window.screen.height, "9.5em");
        StyleControl.CSSBotoes("BtnExcluiProjeto", window.screen.width, window.screen.height, "19.1em");
        document.getElementById("div-after-end").style.setProperty('display', 'flex', 'important');
        this.GetProjectByID();
    }


    GetProjectByID = () => {
        ApiService.ProjectByID(idProjeto, tokenRef).then(res => {
            if (res.status === STATUS_200)
                this.PreencheDadosProjeto(res.data, res.percent);
            else {
                PopUp.ExibeMensagem('error', "Não foi possível encontrar o projeto");
                Log.LogError("VisualizaProjeto", "GetProjectByID", res.message);
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', 'Falha na comunicação com a API');
            Log.LogError("VisualizaProjeto", "GetProjectByID", err.message);
        });
    }


    PreencheDadosProjeto = (dados, percent) => {
        console.log(percent);
        document.getElementById("NomeProjetoEdit").value = dados.Nome;
        document.getElementById("DescProjetoEdit").value = dados.Descricao;
        document.getElementById("DtInicioProjetoEdit").value = dados.DtInicio;
        document.getElementById("DtFinalProjetoEdit").value = dados.DtFinal;
        document.getElementById("DtCadastroEdit").value = dados.DtCadastro;

        if (Number(percent !== -99)) {
            document.getElementById("barProgressLine").style.width = percent + "%";
            document.getElementById("barProgressLine").innerHTML = percent + "%";
        }
        else{
            document.getElementById("barProgressLine").style.width = dados.Porcentagem + "%";
            document.getElementById("barProgressLine").innerHTML = dados.Porcentagem + "%";
        }

        if (Number(dados.Atrasado === 0))
            document.getElementById("AtrasadoEdit").value = "Não";
        else
            document.getElementById("AtrasadoEdit").value = "Sim";


        if (Number(dados.Finalizado === 0))
            document.getElementById("FinalizadoEdit").value = "Não";
        else
            document.getElementById("FinalizadoEdit").value = "Sim";
    }


    ValidaCamposNulos = () => {
        try {
            let campoNulo = "";

            if (document.getElementById("NomeProjetoEdit").value !== "") {
                if (document.getElementById("DtInicioProjetoEdit").value !== "") {
                    if (document.getElementById("DtFinalProjetoEdit").value !== "") {
                        if (document.getElementById("DtCadastroEdit").value !== "") {
                            campoNulo = "";
                        }
                        else campoNulo = "Data de Cadastro";
                    }
                    else campoNulo = "Data Final";
                }
                else campoNulo = "Data Início";
            }
            else campoNulo = "Nome do Projeto";

            if (campoNulo !== "")
                PopUp.ExibeMensagem('info', "O campo '" + campoNulo + "' não pode ser nulo!");
            else {
                this.handleOpen();
            }
        }
        catch (err) {
            Log.LogError("VisualizaProjeto", "ValidaCamposNulos", err.message);
        }
    }


    handleOpen = () => {
        this.setState({
            openDialog: true,
            dialogText: "Você deseja realmente editar o projeto '" + document.getElementById("NomeProjetoEdit").value + "'?"
        });
    };


    handleClose = () => {
        this.setState({ openDialog: false });
    };


    handleConfirm = () => {
        this.setState({ openDialog: false });
        this.EditaProjeto();
    }


    EditaProjeto = () => {
        if (AutenticacaoSession.Authorize()) {
            this.GetDadosProjeto();

            fetch('http://' + window.location.hostname + ':5000/api/sgp/edit/project', {
                method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "idProjeto": idProjeto, "nome": nome, "descricao": descricao, "dtInicio": dtInicio,
                    "dtFinal": dtFinal, "finalizado": finalizado, "dtCadastro": dtCadastro, "token": tokenRef,
                })
            }).then((response) => response.json()).then((res) => {
                if (res.status === 200) {
                    PopUp.ExibeMensagem('success', res.message);
                    this.GetProjectByID();
                }
                else {
                    PopUp.ExibeMensagem('error', "Não foi possível editar o Projeto!");
                    Log.LogError("VisualizaProjeto", "EditaProjeto", res.message);
                }
            }).catch(err => {
                PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
                Log.LogError("VisualizaProjeto", "EditaProjeto", err.message);
            });
        }
        else
            PopUp.ExibeMensagem('error', "Autorização Negada!");
    }


    GetDadosProjeto = () => {
        try {
            nome = document.getElementById("NomeProjetoEdit").value;
            descricao = document.getElementById("DescProjetoEdit").value;
            dtInicio = document.getElementById("DtInicioProjetoEdit").value;
            dtFinal = document.getElementById("DtFinalProjetoEdit").value;
            dtCadastro = document.getElementById("DtCadastroEdit").value;

            if (document.getElementById("FinalizadoEdit").value === "Sim")
                finalizado = 1;
            else
                finalizado = 0;
        }
        catch (err) {
            Log.LogError("VisualizaProjeto", "GetDadosProjeto", err.message);
        }
    }


    VisualizaAtividades = () => {
        window.location.href = "MinhasAtividades?Ref=" + tokenRef + "&IdProjeto=" + idProjeto;
    }


    CloseDialogInativaProjeto = () => {
        this.setState({ openBoxInativaProjeto: false });
    }


    ConfirmDialogInativaProjeto = () => {
        this.setState({ openBoxInativaProjeto: false });
        this.InativaProjeto();
    }


    InativaProjeto = () => {
        ApiService.ControleProjetoAtivo(idProjeto, INATIVA, tokenRef).then(res => {
            if (res.status === STATUS_200) {
                PopUp.ExibeMensagem('success', res.message);
                setTimeout(() => { this.Voltar(); }, 1000);
            }
            else if (res.status === STATUS_400)
                PopUp.ExibeMensagem('info', res.message, 6000);
            else {
                PopUp.ExibeMensagem('error', "Não foi possível inativar o projeto");
                Log.LogError("VisualizaProjeto", "InativaProduto", res.message);
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
            Log.LogError("VisualizaProjeto", "InativaProduto", err.message);
        });
    }


    CloseDialogExcluiProjeto = () => {
        this.setState({ openBoxExcluiProjeto: false });
    }


    ConfirmDialogExcluiProjeto = () => {
        this.setState({ openBoxExcluiProjeto: false });
        this.ExcluiProjeto();
    }


    ExcluiProjeto = () => {
        ApiService.ExcluiProjeto(idProjeto, tokenRef).then(res => {
            if (res.status === STATUS_200) {
                PopUp.ExibeMensagem('success', res.message);
                setTimeout(() => { this.Voltar(); }, 1000);
            }
            else {
                PopUp.ExibeMensagem('error', "Não foi possível excluir o projeto");
                Log.LogError("VisualizaProjeto", "ExcluiProjeto", res.message);
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
            Log.LogError("VisualizaProjeto", "ExcluiProjeto", err.message);
        });
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
            <div className="body-visualiza-projeto">
                <Dialog open={this.state.openDialog} onClose={this.handleClose} aria-labelledby="draggable-dialog-title">
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Edição!</DialogTitle>
                    <DialogContent><DialogContentText>{this.state.dialogText}</DialogContentText></DialogContent>
                    <DialogActions>
                        <Button className="dialog-padrao" onClick={this.handleConfirm} color="primary">Sim</Button>
                        <Button className="dialog-padrao" onClick={this.handleClose} color="primary">Não</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.openBoxInativaProjeto} onClose={this.CloseDialogInativaProjeto} aria-labelledby="draggable-dialog-title">
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Aviso!</DialogTitle>
                    <DialogContent><DialogContentText>Você deseja realmente inativar este projeto?</DialogContentText></DialogContent>
                    <DialogActions>
                        <Button className="dialog-padrao" onClick={this.ConfirmDialogInativaProjeto} color="primary">Sim</Button>
                        <Button className="dialog-padrao" onClick={this.CloseDialogInativaProjeto} color="primary">Não</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.openBoxExcluiProjeto} onClose={this.CloseDialogExcluiProjeto} aria-labelledby="draggable-dialog-title">
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Aviso!</DialogTitle>
                    <DialogContent><DialogContentText>Você deseja realmente excluir este projeto?</DialogContentText></DialogContent>
                    <DialogActions>
                        <Button className="dialog-padrao" onClick={this.ConfirmDialogExcluiProjeto} color="primary">Sim</Button>
                        <Button className="dialog-padrao" onClick={this.CloseDialogExcluiProjeto} color="primary">Não</Button>
                    </DialogActions>
                </Dialog>

                <div className="menu-superior">
                    <AssignmentTurnedInTwoToneIcon className="icons-menu" color="primary" onClick={this.VisualizaAtividades} />
                    <Button className="buttons-menu" onClick={this.VisualizaAtividades}>Atividades</Button>
                    <AccountTreeTwoToneIcon className="icons-menu" style={{ marginLeft: '1em' }} color="primary" onClick={this.GoToMeusProjetos} />
                    <Button className="buttons-menu" onClick={this.GoToMeusProjetos}>Meus Projetos</Button>
                    <HourglassFullTwoToneIcon className="icons-menu" style={{ marginLeft: '1em' }} color="primary" />
                    <Button className="buttons-menu">Tempo Gasto Geral</Button>
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
                            <div className="div-inputs-padrao" style={{ marginTop: '20px' }}>
                                <TextField type="text" autoFocus helperText="Nome do Projeto" id="NomeProjetoEdit" className="half-inputs-padrao" placeholder="Nome *" />
                                <textarea id="DescProjetoEdit" className="textarea-projeto-edit" style={{ marginLeft: '10%' }} placeholder="Descrição"></textarea>
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="date" helperText="Data Início" id="DtInicioProjetoEdit" className="half-inputs-padrao" />
                                <TextField type="date" helperText="Data Final" id="DtFinalProjetoEdit" style={{ marginLeft: '10%' }} className="half-inputs-padrao" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <div id="divProgressProducao">
                                    <div id="barProgressLine"></div>
                                </div>
                                <TextField type="text" helperText="Atrasado?" inputProps={{ readOnly: true }} id="AtrasadoEdit" style={{ marginLeft: '10%' }} className="half-inputs-padrao" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="date" helperText="Data de Cadastro" id="DtCadastroEdit" className="half-inputs-padrao" />
                                <TextField type="text" helperText="Finalizado?" onFocus={() => ClearField("FinalizadoEdit")} onBlur={() => ConfigControl("FinalizadoEdit")} inputProps={{ list: "lstFinalizado" }} id="FinalizadoEdit" style={{ marginLeft: '10%' }} className="half-inputs-padrao" />
                                <datalist id="lstFinalizado">
                                    <option key={0} value={"Sim"} />
                                    <option key={1} value={"Não"} />
                                </datalist>
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao" />
                            <div className="div-inputs-padrao">
                                <Button className="button-style-padrao" onClick={this.ValidaCamposNulos}>Editar</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Button id="BtnVoltarProjeto" className="btn-padrao" onClick={this.Voltar}>Voltar</Button>
                <Button id="BtnInativaProjeto" className="btn-padrao" onClick={() => this.setState({ openBoxInativaProjeto: true })}>Inativar</Button>
                <Button id="BtnExcluiProjeto" className="btn-padrao" style={{ color: 'red' }} onClick={() => this.setState({ openBoxExcluiProjeto: true })}>Excluir</Button>
                <div id="div-after-end"></div>
            </div>
        )
    }
}
export default VisualizaProjeto;