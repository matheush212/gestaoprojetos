import React, { Component, Fragment } from 'react';
import Header from '../../Header/Header';
import Body from '../../Body/AlteraSenha/AlteraSenha';
import Footer from '../../Footer/Footer';


class AlteraSenha extends Component {
  render() {
    return (
      <Fragment>
        <Header title="Altera Senha"/>
        <Body />
        <Footer />
      </Fragment>
    )
  }
}
export default AlteraSenha;
