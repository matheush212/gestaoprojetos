import React, { Component, Fragment } from 'react';
import Header from '../../Header/Header';
import Body from '../../Body/MinhasAtividades/MinhasAtividades';
import Footer from '../../Footer/Footer';


class MinhasAtividades extends Component {
  render() {
    return (
      <Fragment>
        <Header title="Atividades"/>
        <Body />
        <Footer />
      </Fragment>
    )
  }
}
export default MinhasAtividades;
