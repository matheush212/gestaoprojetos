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
import { ConvertDate } from '../../../Functions/ConvertDateToBR';
import { ClearField, ConfigControl } from '../../../Functions/ConfigTextFieldList';
import StyleControl from '../../../Functions/ControleCSSBotoes';
import AutenticacaoSession from '../../../Autenticacao/AutenticacaoSession';
import Log from '../../../Functions/GeraLog';
let nome = '', descricao = '', dtInicio = '', dtFinal = '', finalizado = '', dtCadastro = '';
let tokenRef = UrlParam.queryString("Ref");
let idProjeto = UrlParam.queryString("IdProjeto");
const STATUS_200 = 200;


class VisualizaProjeto extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openDialog: false,
            dialogText: ''
        }
    }


    componentDidMount() {
        StyleControl.CSSBotoes("BtnVisualizaProjeto", window.screen.width, window.screen.height);
        StyleControl.CSSBotoes("BtnVisualizaAtividades", window.screen.width, window.screen.height, "9.5em");
        document.getElementById("div-after-end").style.setProperty('display', 'flex', 'important');
        this.GetProjectByID();
    }


    GetProjectByID = () => {
        ApiService.ProjectByID(idProjeto, tokenRef).then(res => {
            if (res.status === STATUS_200)
                this.PreencheDadosProjeto(res.data);
            else {
                PopUp.ExibeMensagem('error', "Não foi possível encontrar o projeto");
                Log.LogError("VisualizaProjeto", "GetProjectByID", res.message);
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', 'Falha na comunicação com a API');
            Log.LogError("VisualizaProjeto", "GetProjectByID", err.message);
        });
    }


    PreencheDadosProjeto = (dados) => {
        document.getElementById("NomeProjetoEdit").value = dados.Nome;
        document.getElementById("DescProjetoEdit").value = dados.Descricao;
        document.getElementById("DtInicioProjetoEdit").value = dados.DtInicio;
        document.getElementById("DtFinalProjetoEdit").value = dados.DtFinal;
        document.getElementById("DtCadastroEdit").value = dados.DtCadastro;
        document.getElementById("barProgressLine").style.width = dados.Porcentagem + "%";
        document.getElementById("barProgressLine").innerHTML = dados.Porcentagem + "% Concluído";

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

            fetch('http://' + window.location.hostname + ':5000/api/sgb/edit/project', {
                method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "idProjeto": idProjeto, "nome": nome, "descricao": descricao, "dtInicio": dtInicio,
                    "dtFinal": dtFinal, "finalizado": finalizado, "dtCadastro": dtCadastro, "token": tokenRef,
                })
            }).then((response) => response.json()).then((res) => {
                if (res.status === 200)
                    PopUp.ExibeMensagem('success', res.message);
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


    Voltar = () => {
        window.location.href = "MeusProjetos?Ref=" + tokenRef;
    }


    render() {
        return (
            <div>
                <Dialog open={this.state.openDialog} onClose={this.handleClose} aria-labelledby="draggable-dialog-title">
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Edição!</DialogTitle>
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
                <Button id="BtnVisualizaProjeto" className="btn-padrao" onClick={this.Voltar}>Voltar</Button>
                <Button id="BtnVisualizaAtividades" className="btn-padrao" onClick={this.VisualizaAtividades}>Atividades</Button>
                <div id="div-after-end"></div>
            </div>
        )
    }
}
export default VisualizaProjeto;
