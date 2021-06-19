import React, { Component, Fragment } from 'react';
import './NotAuthenticated.css';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Button from '@material-ui/core/Button';


class NotAuthenticated extends Component {
    GoToHome = () => {
        window.location.href = "/";
    }

    render() {
        return (
            <Fragment>
                <Header title="Área Restrita" />
                <div className="not-authenticated">OPS... Você não tem permissão para acessar esta página!<br />Logue no sistema para continuar!</div>
                <div className="div-voltar-authenticated"><Button className="btn-voltar-authenticated" onClick={this.GoToHome}>Sair</Button></div>
                <div className="div-after-end-notAuth"></div>
                <Footer />
            </Fragment>
        );
    }
}
export default NotAuthenticated;