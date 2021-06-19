import React, { Fragment } from 'react';
import './NotFound.css';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Button from '@material-ui/core/Button';

const GoToHome = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("idUser", "");
    window.location.href = "/";
}

const NotFound = () => {
    return (
        <Fragment>
            <Header title="Not Found"/>
            <div className="not-found">OPS... Esta página não existe!</div>
            <div className="div-voltar-not-found"><Button className="btn-voltar-not-found" onClick={GoToHome}>Sair</Button></div>
            <div className="div-after-end-notFound"></div>
            <Footer/>
        </Fragment>
    );
}
export default NotFound;