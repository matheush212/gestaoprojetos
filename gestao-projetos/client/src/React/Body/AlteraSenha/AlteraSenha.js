import React from 'react';
import './AlteraSenha.css';
import 'materialize-css/dist/css/materialize.min.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import VisibilityTwoToneIcon from '@material-ui/icons/VisibilityTwoTone';
import VisibilityOffTwoToneIcon from '@material-ui/icons/VisibilityOffTwoTone';
import ApiService from '../../Utils/ApiService';
import PopUp from '../../Utils/PopUp';
import ShowPassword from '../../../Functions/ShowPassword';
import UrlParam from '../../../Functions/GetUrlParameters';
import Log from '../../../Functions/GeraLog';
import StyleControl from '../../../Functions/ControleCSSBotoes';
import DestroySession from '../../../Functions/DestroySession';
import AutenticacaoSession from '../../../Autenticacao/AutenticacaoSession';
let idUsuario = "";
let tokenRef = UrlParam.queryString("Ref");
const STATUS_200 = 200;
const STATUS_400 = 400;


class AlteraSenha extends React.Component {
    componentDidMount() {
        StyleControl.CSSBotoesPlus("btnAlteraSenha", window.screen.width, window.screen.height);
        document.getElementById("div-after-end").style.setProperty('display', 'flex', 'important');
        this.GetPerfil();
    }


    GetPerfil = () => {
        ApiService.GetUserProfile(tokenRef).then(res => {
            if (res.status === 200) {
                idUsuario = res.data[0].UserID;
            }
            else {
                PopUp.ExibeMensagem('error', "Não foi possível buscar o usuário");
                Log.LogError("AlteraSenha", "GetPerfil", res.message);
                window.location.href = "NotAuthenticated";
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
            Log.LogError("AlteraSenha", "GetPerfil", err.message);
        });
    }


    AlterarSenhaUser = () => {
        if (!this.ValidaCamposNulosAteraSenha()) {
            if (this.NovasSenhasCoincidem()) {
                if (AutenticacaoSession.Authorize()) {
                    fetch('http://' + window.location.hostname + ':5000/api/sgp/users/alterasenha', {
                        method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            "idUsuario": idUsuario, "senhaAtual": document.getElementById("SenhaAtual").value,
                            "novaSenha": document.getElementById("NovaSenha").value,
                            "token": tokenRef
                        })
                    }).then((response) => response.json()).then((res) => {
                        if (res.status === STATUS_200) {
                            PopUp.ExibeMensagem('success', res.message);
                            PopUp.ExibeMensagem('info', 'Você será deslogado!');
                            setTimeout(() => { DestroySession.Destroy(tokenRef);}, 1000);
                            
                        }
                        else if (res.status === STATUS_400)
                            PopUp.ExibeMensagem('info', res.message);
                        else {
                            PopUp.ExibeMensagem('error', res.message);
                            Log.LogError("AlteraSenha", "AlterarSenhaUser", res.message);
                        }

                    }).catch(err => {
                        PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
                        Log.LogError("AlteraSenha", "AlterarSenhaUser", err.message);
                    });
                }
                else
                    PopUp.ExibeMensagem('error', "Autorização Negada!");
            }
        }
        else
            PopUp.ExibeMensagem('error', 'Preenche todos os campos!');
    }


    ValidaCamposNulosAteraSenha = () => {
        try {
            if (document.getElementById("SenhaAtual").value !== "") {
                if (document.getElementById("NovaSenha").value !== "") {
                    if (document.getElementById("ConfirmaNovaSenha").value !== "") {
                        return false;
                    }
                }
            }
            return true;
        }
        catch (err) {
            Log.LogError("AlteraSenha", "ValidaCamposNulosAteraSenha", err.message);
        }
    }


    NovasSenhasCoincidem = () => {
        try {
            if (document.getElementById("NovaSenha").value === document.getElementById("ConfirmaNovaSenha").value)
                return true;
            else {
                PopUp.ExibeMensagem('info', "Os campos de 'Nova Senha' não coincidem!");
                document.getElementById("NovaSenha").value = "";
                document.getElementById("ConfirmaNovaSenha").value = "";
                return false;
            }
        }
        catch (err) {
            Log.LogError("AlteraSenha", "NovasSenhasCoincidem", err.message);
        }
    }


    ViewSenhaAtual = () => {
        ShowPassword.View("SenhaAtual", "VisibleActualPassw", "VisibleActualPasswOff")
    };


    ViewNovaSenha = () => {
        ShowPassword.View("NovaSenha", "VisibleNewPassw", "VisibleNewPasswOff")
    };


    ViewConfNovaSenha = () => {
        ShowPassword.View("ConfirmaNovaSenha", "VisibleConfNewPassw", "VisibleConfNewPasswOff")
    };


    Voltar = () => {
        window.location.href = "MeusProjetos?Ref=" + tokenRef;
    }


    render() {
        return (
            <div>
                <div className="container altera-senha-box">
                    <div>
                        <div className="row">
                            <div className="div-assist-change-passw"></div>
                            <div className="div-inputs-change-passw">
                                <TextField type="password" helperText="Senha Atual" id="SenhaAtual" autoFocus className="inputs-padrao" placeholder="Digite a senha atual..." />
                                <VisibilityTwoToneIcon id="VisibleActualPassw" className="visible-password-pos" onClick={this.ViewSenhaAtual} />
                                <VisibilityOffTwoToneIcon id="VisibleActualPasswOff" className="visible-password-off-pos" onClick={this.ViewSenhaAtual} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-change-passw"></div>
                            <div className="div-inputs-change-passw">
                                <TextField type="password" helperText="Nova Senha" id="NovaSenha" className="inputs-padrao" placeholder="Digite a nova senha..." />
                                <VisibilityTwoToneIcon id="VisibleNewPassw" className="visible-password-pos" onClick={this.ViewNovaSenha} />
                                <VisibilityOffTwoToneIcon id="VisibleNewPasswOff" className="visible-password-off-pos" onClick={this.ViewNovaSenha} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-change-passw"></div>
                            <div className="div-inputs-change-passw">
                                <TextField type="password" helperText="Confirmação de Senha" id="ConfirmaNovaSenha" className="inputs-padrao" placeholder="Confirme a nova senha..." />
                                <VisibilityTwoToneIcon id="VisibleConfNewPassw" className="visible-password-pos" onClick={this.ViewConfNovaSenha} />
                                <VisibilityOffTwoToneIcon id="VisibleConfNewPasswOff" className="visible-password-off-pos" onClick={this.ViewConfNovaSenha} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="div-assist-change-passw" />
                            <div className="div-inputs-change-passw">
                                <Button className="button-style-padrao" onClick={this.AlterarSenhaUser}>Alterar</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Button id="btnAlteraSenha" className="btn-padrao" onClick={this.Voltar}>Voltar</Button>
                <div id="div-after-end"></div>
            </div>
        )
    }
}
export default AlteraSenha;
