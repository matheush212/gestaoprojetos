import React, { Component, Fragment } from 'react';
import Header from '../../Header/Header';
import Body from '../../Body/AlteraPerfil/AlteraPerfil';
import Footer from '../../Footer/Footer';


class AlteraPerfil extends Component {
  render() {
    return (
      <Fragment>
        <Header title="Perfil"/>
        <Body />
        <Footer />
      </Fragment>
    )
  }
}
export default AlteraPerfil;
