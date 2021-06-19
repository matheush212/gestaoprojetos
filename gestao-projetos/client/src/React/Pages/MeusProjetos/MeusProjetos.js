import React, { Component, Fragment } from 'react';
import Header from '../../Header/Header';
import Body from '../../Body/MeusProjetos/MeusProjetos';
import Footer from '../../Footer/Footer';


class MeusProjetos extends Component {
  render() {
    return (
      <Fragment>
        <Header title="Meus Projetos"/>
        <Body />
        <Footer />
      </Fragment>
    )
  }
}
export default MeusProjetos;
