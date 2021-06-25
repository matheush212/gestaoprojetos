import React from 'react';
import './AlteraPerfil.css';
import 'materialize-css/dist/css/materialize.min.css';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/VerifiedUser';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ApiService from '../../Utils/ApiService';
import PopUp from '../../Utils/PopUp';
import UrlParam from '../../../Functions/GetUrlParameters';
import DestroySession from '../../Utils/DestroySession';
import Log from '../../../Functions/GeraLog';
import StyleControl from '../../../Functions/ControleCSSBotoes';
import AutenticacaoSession from '../../../Autenticacao/AutenticacaoSession';
let idUsuario = "";
let tokenRef = UrlParam.queryString("Ref");


class AlteraPerfil extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            inicialLogin: ""
        }
    }

    componentDidMount() {
        StyleControl.CSSBotoes("btnAlteraPerfil", window.screen.width, window.screen.height);
        document.getElementById("div-after-end").style.setProperty('display', 'flex', 'important');
        this.GetPerfil();
    }


    GetPerfil = () => {
        ApiService.GetUserProfile(tokenRef).then(res => {
            if (res.status === 200) {
                idUsuario = res.data[0].UserID;
                this.GetDados();
            }
            else {
                PopUp.ExibeMensagem('error', "Não foi possível buscar o usuário");
                Log.LogError("AlteraPerfil", "GetPerfil", res.message);
                window.location.href = "NotAuthenticated";
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
            Log.LogError("AlteraPerfil", "GetPerfil", err.message);
        });
    }


    GetDados = () => {
        ApiService.GetDadosUser(idUsuario, tokenRef).then(res => {
            if (res.status === 200) {
                PopUp.ExibeMensagem('success', "Dados de perfil carregados");
                this.setState({ inicialLogin: String(res.data.Login).substr(0, 1) })
                document.getElementById("NomeUsuarioPerfil").value = res.data.Nome;
                document.getElementById("LoginUsuarioPerfil").value = res.data.Login;
            }
            else {
                PopUp.ExibeMensagem('error', "Não foi possível carregar os dados do Uusário");
                Log.LogError("AlteraPerfil", "GetDados", res.message);
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
            Log.LogError("AlteraPerfil", "GetDados", err.message);
        });
    }


    AlteraPerfilUsuario = () => {
        if (!this.ValidaCamposNulosAlteraPerfil()) {
            if (AutenticacaoSession.Authorize()) {
                fetch('http://' + window.location.hostname + ':5000/api/sgp/users/alteraperfil', {
                    method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "idUsuario": idUsuario, "nome": document.getElementById("NomeUsuarioPerfil").value,
                        "login": document.getElementById("LoginUsuarioPerfil").value,
                        "token": tokenRef
                    })
                }).then((response) => response.json()).then((res) => {
                    if (res.status === 200) {
                        PopUp.ExibeMensagem('success', res.message);
                        PopUp.ExibeMensagem('info', 'Você será deslogado!');
                        setTimeout(() => { DestroySession.Destroy(tokenRef);}, 1000);
                    }
                    else {
                        PopUp.ExibeMensagem('error', "");
                        Log.LogError("AlteraPerfil", "AlteraPerfilUsuario", res.message);
                    }
                }).catch(err => {
                    PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
                    Log.LogError("AlteraPerfil", "AlteraPerfilUsuario", err.message);
                });
            }
            else
                PopUp.ExibeMensagem('error', "Autorização Negada!");
        }
        else
            PopUp.ExibeMensagem('error', 'Preenche todos os campos!');
    }


    ValidaCamposNulosAlteraPerfil = () => {
        try {
            if (document.getElementById("NomeUsuarioPerfil").value !== "") {
                if (document.getElementById("LoginUsuarioPerfil").value !== "") {
                    return false;
                }
            }
            return true;
        }
        catch (err) {
            Log.LogError("AlteraPerfil", "ValidaCamposNulosAlteraPerfil", err.message);
        }
    }


    Voltar = () => {
        window.location.href = "MeusProjetos?Ref=" + tokenRef;
    }


    render() {
        return (
            <div>
                <Avatar className="avatar-perfil"> <LockOutlinedIcon /> </Avatar>
                <div className="container altera-perfil-box">
                    <div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <div className="perfil-img">{this.state.inicialLogin.toUpperCase()}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="text" helperText="Nome" id="NomeUsuarioPerfil" autoFocus className="inputs-padrao" placeholder="Digite o seu nome..." />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao"></div>
                            <div className="div-inputs-padrao">
                                <TextField type="text" helperText="Login" id="LoginUsuarioPerfil" className="inputs-padrao" placeholder="Digite o seu login..." />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-padrao" />
                            <div className="div-inputs-padrao">
                                <Button className="button-style-padrao" onClick={this.AlteraPerfilUsuario}>Alterar</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Button id="btnAlteraPerfil" className="btn-padrao" onClick={this.Voltar}>Voltar</Button>
                <div id="div-after-end"></div>
            </div>
        )
    }
}
export default AlteraPerfil;
