import React from 'react';
import './Autenticacao.css';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';
import VisibilityTwoToneIcon from '@material-ui/icons/VisibilityTwoTone';
import VisibilityOffTwoToneIcon from '@material-ui/icons/VisibilityOffTwoTone';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import ApiService from '../../Utils/ApiService';
import PopUp from '../../Utils/PopUp';
import Log from '../../../Functions/GeraLog';
import { v4 as uuidv4 } from 'uuid';
const ENTER = 13;


const CheckSuccessLogin = (login, paswd) => {
    try {
        if (login === "" || paswd === "")
            PopUp.ExibeMensagem('error', "Login Incorreto!");
        else {
            fetch('http://' + window.location.hostname + ':5000/api/sgp/check/login', {
                method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "login": String(login).toUpperCase(),
                    "password": paswd
                })
            }).then((response) => response.json()).then((res) => {
                if (res.status === 200) {
                    PopUp.ExibeMensagem('success', res.message);
                    SaveProfile(res);
                }
                else
                    PopUp.ExibeMensagem('error', res.message);

            }).catch(err => {
                PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
                Log.LogError("Autenticacao", "CheckSuccessLogin", err.message);
            });
        }
    }
    catch (err) {
        Log.LogError("Autenticacao", "CheckSuccessLogin", err.message);
    }
}


const SaveProfile = (res) => {
    let accessID = uuidv4();
    ApiService.SaveUserProfile(accessID, res.data.Id, res.data.TipoUsuario, res.token)
        .then(res => {
            if (res.status === 200)
                window.location.href = 'MeusProjetos?Ref=' + accessID;
            else {
                PopUp.ExibeMensagem('error', "Não foi possível criar a sessão! Por favor, tente novamente!");
                Log.LogError("Autenticacao", "SaveProfile", res.message);
            }
        })
        .catch(err => {
            PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
            Log.LogError("Autenticacao", "SaveProfile", err.message);
        });
}


const ViewPassword = () => {
    try {
        let passwordField = document.getElementById("PasswordField");
        let visibleIcon = document.getElementById("visible-icon");
        let visibleIconOff = document.getElementById("visible-icon-off");

        if (passwordField.type === "password") {
            passwordField.type = "text";
            visibleIcon.style.setProperty('display', 'none', 'important');
            visibleIconOff.style.setProperty('display', 'initial', 'important');

        } else {
            passwordField.type = "password";
            visibleIconOff.style.setProperty('display', 'none', 'important');
            visibleIcon.style.setProperty('display', 'initial', 'important');
        }
    }
    catch (err) {
        Log.LogError("Autenticacao", "ViewPassword", err.message);
    }
}


const EnterKeyPressLogin = (event) => {
    if (event.keyCode === ENTER){
        let login = document.getElementById("LoginField").value;
        let passw = document.getElementById("PasswordField").value;
        CheckSuccessLogin(login, passw);
    }
}


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(3), display: 'flex', flexDirection: 'column', alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1), backgroundColor: 'black',
    },
    form: {
        width: '100%', marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2), backgroundColor: '#00103B'
    },
}));


const ContainerLogin = () => {
    const classes = useStyles();

    return (
        <div className="autentication-position">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}> <LockOutlinedIcon /> </Avatar>
                <Typography component="h1" variant="h5"> Login </Typography>
                <form className={classes.form} noValidate>
                    <TextField variant="outlined" margin="normal" autoFocus className="login-field-style" fullWidth id="LoginField" label="Login" onKeyUp={EnterKeyPressLogin}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><AccountCircleTwoToneIcon /></InputAdornment>
                            ),
                        }}
                    />
                    <TextField variant="outlined" margin="normal" fullWidth label="Senha" type="password" id="PasswordField" onKeyUp={EnterKeyPressLogin}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><LockTwoToneIcon /></InputAdornment>
                            ),
                        }}
                    />
                    <div className="div-password-icon">
                        <VisibilityTwoToneIcon id="visible-icon" className="visible-password-position" onClick={ViewPassword} />
                        <VisibilityOffTwoToneIcon id="visible-icon-off" className="visible-password-off-position" onClick={ViewPassword} />
                    </div>
                    <Button fullWidth variant="contained" color="primary" className="button-login-style" onClick={CheckSuccessLogin}>Logar</Button>
                    <div className="div-space-after-end"></div>
                </form>
            </div>

        </div>
    );
}
export default ContainerLogin;
