import React from 'react';
import './NovoProjeto.css';
import 'materialize-css/dist/css/materialize.min.css';
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
import StyleControl from '../../../Functions/ControleCSSBotoes';
import AutenticacaoSession from '../../../Autenticacao/AutenticacaoSession';
import Log from '../../../Functions/GeraLog';
let nome = '', descricao = '', dtInicio = '', dtFinal = '', dtCadastro = '';
let tokenRef = UrlParam.queryString("Ref");


class NovoProjeto extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openDialog: false,
            dialogText: ''
        }
    }


    componentDidMount() {
        StyleControl.CSSBotoes("BtnNovoProjeto", window.screen.width, window.screen.height);
        document.getElementById("div-after-end").style.setProperty('display', 'flex', 'important');
    }


    ValidaCamposNulos = () => {
        try {
            let campoNulo = "";

            if (document.getElementById("NomeProjeto").value !== "") {
                if (document.getElementById("DtInicioProjeto").value !== "") {
                    if (document.getElementById("DtFinalProjeto").value !== "") {
                        campoNulo = "";
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
            Log.LogError("NovoProjeto", "ValidaCamposNulos", err.message);
        }
    }


    handleOpen = () => {
        this.setState({
            openDialog: true,
            dialogText: "Você deseja realmente cadastrar o projeto '" + document.getElementById("NomeProjeto").value + "'?"
        });
    };


    handleClose = () => {
        this.setState({ openDialog: false });
    };


    handleConfirm = () => {
        this.setState({ openDialog: false });
        this.CadastraProjeto();
    }


    CadastraProjeto = () => {
        if (AutenticacaoSession.Authorize()) {
            this.GetDadosProjeto();

            fetch('http://' + window.location.hostname + ':5000/api/sgb/new/project', {
                method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "nome": nome, "descricao": descricao, "dtInicio": dtInicio,
                    "dtFinal": dtFinal, "dtCadastro": GetDate.ReturnCurrentDate(), "token": tokenRef,
                })
            }).then((response) => response.json()).then((res) => {
                if (res.status === 200) {
                    PopUp.ExibeMensagem('success', res.message);
                    this.LimpaCampos();
                    this.ResetVariaveis();
                }
                else {
                    PopUp.ExibeMensagem('error', "Não foi possível cadastrar o Projeto!");
                    Log.LogError("NovoProjeto", "CadastraProjeto", res.message);
                }
            }).catch(err => {
                PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
                Log.LogError("NovoProjeto", "CadastraProjeto", err.message);
            });
        }
        else
            PopUp.ExibeMensagem('error', "Autorização Negada!");
    }


    GetDadosProjeto = () => {
        try {
            nome = document.getElementById("NomeProjeto").value;
            descricao = document.getElementById("DescProjeto").value;
            dtInicio = document.getElementById("DtInicioProjeto").value;
            dtFinal = document.getElementById("DtFinalProjeto").value;
        }
        catch (err) {
            Log.LogError("NovoProjeto", "GetDadosProjeto", err.message);
        }
    }


    LimpaCampos = () => {
        document.getElementById("NomeProjeto").value = "";
        document.getElementById("DescProjeto").value = "";
        document.getElementById("DtInicioProjeto").value = "";
        document.getElementById("DtFinalProjeto").value = "";
    }


    ResetVariaveis = () => {
        nome = "";
        descricao = "";
        dtInicio = "";
        dtFinal = "";
        dtCadastro = "";
    }


    Voltar = () => {
        window.location.href = "MeusProjetos?Ref=" + tokenRef;
    }


    render() {
        return (
            <div>
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
                <div className="container">
                    <div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao" style={{ marginTop: '20px' }}>
                                <TextField type="text" autoFocus helperText="Nome do Projeto" id="NomeProjeto" className="inputs-padrao" placeholder="Nome *" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <textarea id="DescProjeto" className="textarea-projeto" placeholder="Descrição"></textarea>
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="date" helperText="Data Início" id="DtInicioProjeto" className="inputs-padrao" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="date" helperText="Data Final" id="DtFinalProjeto" className="inputs-padrao" />
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
                <Button id="BtnNovoProjeto" className="btn-padrao" onClick={this.Voltar}>Voltar</Button>
                <div id="div-after-end"></div>
            </div>
        )
    }
}
export default NovoProjeto;
