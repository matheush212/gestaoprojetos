import React, { Component, Fragment } from 'react';
import Header from '../../Header/Header';
import Body from '../../Body/Autenticacao/Autenticacao';
import Footer from '../../Footer/Footer';


class Autenticacao extends Component {
  render() {
    return (
      <Fragment>
        <Header title="Autenticação"/>
        <Body />
        <Footer />
      </Fragment>
    )
  }
}
export default Autenticacao;
