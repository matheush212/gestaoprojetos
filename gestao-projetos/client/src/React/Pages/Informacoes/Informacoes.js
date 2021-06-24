import React, { Component, Fragment } from 'react';
import Header from '../../Header/Header';
import Body from '../../Body/Informacoes/Informacoes';
import Footer from '../../Footer/Footer';


class Informacoes extends Component {
  render() {
    return (
      <Fragment>
        <Header title="Informacoes"/>
        <Body />
        <Footer />
      </Fragment>
    )
  }
}
export default Informacoes;
