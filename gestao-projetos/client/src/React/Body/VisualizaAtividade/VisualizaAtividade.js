import React from 'react';
import './VisualizaAtividade.css';
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
import InfoTwoToneIcon from '@material-ui/icons/InfoTwoTone';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ClearField, ConfigControl } from '../../../Functions/ConfigTextFieldList';
import StyleControl from '../../../Functions/ControleCSSBotoes';
import AutenticacaoSession from '../../../Autenticacao/AutenticacaoSession';
import Log from '../../../Functions/GeraLog';
let idProjeto = '', nome = '', descricao = '', dtInicio = '', dtFinal = '', finalizado = '', dtCadastro = '';
let tokenRef = UrlParam.queryString("Ref");
let projectID = UrlParam.queryString("IdProjeto");
let idAtividade = UrlParam.queryString("IdAtividade");
const STATUS_200 = 200;
const STATUS_400 = 400;
const ATIVOS = 1;
const INATIVA = 0;
const COD_ERRO = -99;

class VisualizaAtividade extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openDialog: false,
            dialogText: '',
            anchorEl: null,
            projetos: [],
            openBoxInativaAtividade: false,
            openBoxExcluiAtividade: false
        }
    }


    componentDidMount() {
        StyleControl.CSSBotoes("BtnVoltarAtividade", window.screen.width, window.screen.height);
        StyleControl.CSSBotoes("BtnInativaAtividade", window.screen.width, window.screen.height, "9.5em");
        StyleControl.CSSBotoes("BtnExcluiAtividade", window.screen.width, window.screen.height, "19.1em");
        document.getElementById("div-after-end").style.setProperty('display', 'flex', 'important');
        this.GetAllProjects();
        this.GetActivityByID();
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


    GetActivityByID = () => {
        ApiService.ActivityByID(idAtividade, tokenRef).then(res => {
            if (res.status === STATUS_200)
                this.PreencheDadosAtividade(res.data, res.percent, res.atrasado);
            else if (res.status === STATUS_400)
                PopUp.ExibeMensagem('info', res.message);
            else {
                PopUp.ExibeMensagem('error', "Não foi possível encontrar a atividade");
                Log.LogError("VisualizaAtividade", "GetActivityByID", res.message);
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', 'Falha na comunicação com a API');
            Log.LogError("VisualizaAtividade", "GetActivityByID", err.message);
        });
    }


    PreencheDadosAtividade = (dados, percent, atrasado) => {
        document.getElementById("TipoProjetoEdit").value = dados.NomeProjeto;
        document.getElementById("NomeAtividadeEdit").value = dados.Nome;
        document.getElementById("DescAtividadeEdit").value = dados.Descricao;
        document.getElementById("DtInicioAtividadeEdit").value = dados.DtInicio;
        document.getElementById("DtFinalAtividadeEdit").value = dados.DtFinal;
        document.getElementById("DtCadastroAtividadeEdit").value = dados.DtCadastro;

        if (Number(percent !== COD_ERRO)) {
            document.getElementById("barProgressLine").style.width = percent + "%";
            document.getElementById("barProgressLine").innerHTML = percent + "%";
        }
        else {
            document.getElementById("barProgressLine").style.width = dados.Porcentagem + "%";
            document.getElementById("barProgressLine").innerHTML = dados.Porcentagem + "%";
        }


        if (Number(atrasado) !== COD_ERRO) {
            if (Number(atrasado) === 0)
                document.getElementById("AtividadeAtrasadaEdit").value = "Não";
            else
                document.getElementById("AtividadeAtrasadaEdit").value = "Sim";
        }
        else {
            if (Number(dados.Atrasado) === 0)
                document.getElementById("AtividadeAtrasadaEdit").value = "Não";
            else
                document.getElementById("AtividadeAtrasadaEdit").value = "Sim";
        }


        if (Number(dados.Finalizado === 0))
            document.getElementById("AtividadeFinalizadaEdit").value = "Não";
        else
            document.getElementById("AtividadeFinalizadaEdit").value = "Sim";
    }


    ValidaCamposNulos = () => {
        try {
            let campoNulo = "";

            if (document.getElementById("NomeAtividadeEdit").value !== "") {
                if (document.getElementById("DtInicioAtividadeEdit").value !== "") {
                    if (document.getElementById("DtFinalAtividadeEdit").value !== "") {
                        if (document.getElementById("DtCadastroAtividadeEdit").value !== "") {
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
            Log.LogError("VisualizaAtividade", "ValidaCamposNulos", err.message);
        }
    }


    handleOpen = () => {
        this.setState({
            openDialog: true,
            dialogText: "Você deseja realmente editar a atividade '" + document.getElementById("NomeAtividadeEdit").value + "'?"
        });
    };


    handleClose = () => {
        this.setState({ openDialog: false });
    };


    handleConfirm = () => {
        this.setState({ openDialog: false });
        this.EditaAtividade();
    }


    EditaAtividade = () => {
        if (AutenticacaoSession.Authorize()) {
            this.GetDadosAtividade();

            fetch('http://' + window.location.hostname + ':5000/api/sgp/edit/activity', {
                method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "idProjeto": idProjeto, "idAtividade": idAtividade, "nome": nome, "descricao": descricao, "dtInicio": dtInicio,
                    "dtFinal": dtFinal, "finalizado": finalizado, "dtCadastro": dtCadastro, "token": tokenRef,
                })
            }).then((response) => response.json()).then((res) => {
                if (res.status === STATUS_200) {
                    PopUp.ExibeMensagem('success', res.message);
                    this.GetActivityByID();
                }
                else {
                    PopUp.ExibeMensagem('error', "Não foi possível editar o Projeto!");
                    Log.LogError("VisualizaAtividade", "EditaAtividade", res.message);
                }
            }).catch(err => {
                PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
                Log.LogError("VisualizaAtividade", "EditaAtividade", err.message);
            });
        }
        else
            PopUp.ExibeMensagem('error', "Autorização Negada!");
    }


    GetDadosAtividade = () => {
        try {
            let projetoVal = document.getElementById("TipoProjetoEdit").value;
            idProjeto = document.querySelector("#projetosEdit option[value='" + projetoVal + "']").dataset.value;

            nome = document.getElementById("NomeAtividadeEdit").value;
            descricao = document.getElementById("DescAtividadeEdit").value;
            dtInicio = document.getElementById("DtInicioAtividadeEdit").value;
            dtFinal = document.getElementById("DtFinalAtividadeEdit").value;
            dtCadastro = document.getElementById("DtCadastroAtividadeEdit").value;

            if (document.getElementById("AtividadeFinalizadaEdit").value === "Sim")
                finalizado = 1;
            else
                finalizado = 0;
        }
        catch (err) {
            Log.LogError("VisualizaAtividade", "GetDadosAtividade", err.message);
        }
    }


    CloseDialogInativaAtividade = () => {
        this.setState({ openBoxInativaAtividade: false });
    }


    ConfirmDialogInativaAtividade = () => {
        this.setState({ openBoxInativaAtividade: false });
        this.InativaAtividade();
    }


    InativaAtividade = () => {
        ApiService.ControleAtividadeAtiva(idAtividade, INATIVA, tokenRef).then(res => {
            if (res.status === STATUS_200) {
                PopUp.ExibeMensagem('success', res.message);
                setTimeout(() => { this.Voltar(); }, 1000);
            }
            else if (res.status === STATUS_400)
                PopUp.ExibeMensagem('info', res.message, 6000);
            else {
                PopUp.ExibeMensagem('error', "Não foi possível inativar a atividade");
                Log.LogError("VisualizaAtividade", "InativaProduto", res.message);
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
            Log.LogError("VisualizaAtividade", "InativaProduto", err.message);
        });
    }


    CloseDialogExcluiAtividade = () => {
        this.setState({ openBoxExcluiAtividade: false });
    }


    ConfirmDialogExcluiAtividade = () => {
        this.setState({ openBoxExcluiAtividade: false });
        this.ExcluiAtividade();
    }


    ExcluiAtividade = () => {
        ApiService.ExcluiAtividade(idAtividade, tokenRef).then(res => {
            if (res.status === STATUS_200) {
                PopUp.ExibeMensagem('success', res.message);
                setTimeout(() => { this.Voltar(); }, 1000);
            }
            else {
                PopUp.ExibeMensagem('error', "Não foi possível excluir a atividade");
                Log.LogError("VisualizaAtividade", "ExcluiAtividade", res.message);
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
            Log.LogError("VisualizaAtividade", "ExcluiAtividade", err.message);
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


    GoToInformacoes = () => {
        window.location.href = "Informacoes?Ref=" + tokenRef;
    }


    Voltar = () => {
        window.location.href = "MinhasAtividades?Ref=" + tokenRef + "&IdProjeto=" + projectID;
    }


    render() {
        return (
            <div className="body-visualiza-atividade">
                <Dialog open={this.state.openDialog} onClose={this.handleClose} aria-labelledby="draggable-dialog-title">
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Edição!</DialogTitle>
                    <DialogContent><DialogContentText>{this.state.dialogText}</DialogContentText></DialogContent>
                    <DialogActions>
                        <Button className="dialog-padrao" onClick={this.handleConfirm} color="primary">Sim</Button>
                        <Button className="dialog-padrao" onClick={this.handleClose} color="primary">Não</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.openBoxInativaAtividade} onClose={this.CloseDialogInativaAtividade} aria-labelledby="draggable-dialog-title">
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Aviso!</DialogTitle>
                    <DialogContent><DialogContentText>Você deseja realmente inativar esta atividade?</DialogContentText></DialogContent>
                    <DialogActions>
                        <Button className="dialog-padrao" onClick={this.ConfirmDialogInativaAtividade} color="primary">Sim</Button>
                        <Button className="dialog-padrao" onClick={this.CloseDialogInativaAtividade} color="primary">Não</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.openBoxExcluiAtividade} onClose={this.CloseDialogExcluiAtividade} aria-labelledby="draggable-dialog-title">
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Aviso!</DialogTitle>
                    <DialogContent><DialogContentText>Você deseja realmente excluir esta atividade?</DialogContentText></DialogContent>
                    <DialogActions>
                        <Button className="dialog-padrao" onClick={this.ConfirmDialogExcluiAtividade} color="primary">Sim</Button>
                        <Button className="dialog-padrao" onClick={this.CloseDialogExcluiAtividade} color="primary">Não</Button>
                    </DialogActions>
                </Dialog>

                <div className="menu-superior">
                    <AccountTreeTwoToneIcon className="icons-menu" color="primary" onClick={this.GoToMeusProjetos} />
                    <Button className="buttons-menu" onClick={this.GoToMeusProjetos}>Meus Projetos</Button>
                    <InfoTwoToneIcon className="icons-menu" style={{ marginLeft: '1em' }} color="primary" onClick={this.GoToInformacoes}/>
                    <Button className="buttons-menu" onClick={this.GoToInformacoes}>Informações Gerais</Button>
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
                                <TextField type="text" autoFocus helperText="Projeto" id="TipoProjetoEdit" onFocus={() => ClearField("TipoProjetoEdit")} onBlur={() => ConfigControl("TipoProjetoEdit")} inputProps={{ list: "projetosEdit" }} className="inputs-padrao" placeholder="Projeto *" />
                                <datalist id="projetosEdit">
                                    {this.state.projetos.map((row, index) => {
                                        return (<option key={index} data-value={String(row.Id)} value={row.Nome} />);
                                    })}
                                </datalist>
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="text" autoFocus helperText="Nome da Atividade" id="NomeAtividadeEdit" className="half-inputs-padrao" placeholder="Nome *" />
                                <textarea id="DescAtividadeEdit" className="textarea-atividade-edit" style={{ marginLeft: '10%' }} placeholder="Descrição"></textarea>
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="date" helperText="Data Início" id="DtInicioAtividadeEdit" className="half-inputs-padrao" />
                                <TextField type="date" helperText="Data Final" id="DtFinalAtividadeEdit" style={{ marginLeft: '10%' }} className="half-inputs-padrao" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <div id="divProgressProducao">
                                    <div id="barProgressLine"></div>
                                </div>
                                <TextField type="text" helperText="Atrasado?" inputProps={{ readOnly: true }} id="AtividadeAtrasadaEdit" style={{ marginLeft: '10%' }} className="half-inputs-padrao" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="date" helperText="Data de Cadastro" id="DtCadastroAtividadeEdit" className="half-inputs-padrao" />
                                <TextField type="text" helperText="Finalizado?" id="AtividadeFinalizadaEdit" onFocus={() => ClearField("AtividadeFinalizadaEdit")} onBlur={() => ConfigControl("AtividadeFinalizadaEdit")} inputProps={{ list: "lstAtividadeFinalizada" }} style={{ marginLeft: '10%' }} className="half-inputs-padrao" />
                                <datalist id="lstAtividadeFinalizada">
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
                <Button id="BtnVoltarAtividade" className="btn-padrao" onClick={this.Voltar}>Voltar</Button>
                <Button id="BtnInativaAtividade" className="btn-padrao" onClick={() => this.setState({ openBoxInativaAtividade: true })}>Inativar</Button>
                <Button id="BtnExcluiAtividade" className="btn-padrao" style={{ color: 'red' }} onClick={() => this.setState({ openBoxExcluiAtividade: true })}>Excluir</Button>
                <div id="div-after-end"></div>
            </div>
        )
    }
}
export default VisualizaAtividade;