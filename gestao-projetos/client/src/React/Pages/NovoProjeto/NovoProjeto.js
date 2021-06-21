import React, { Component, Fragment } from 'react';
import Header from '../../Header/Header';
import Body from '../../Body/NovoProjeto/NovoProjeto';
import Footer from '../../Footer/Footer';


class NovoProjeto extends Component {
  render() {
    return (
      <Fragment>
        <Header title="Novo Projeto"/>
        <Body />
        <Footer />
      </Fragment>
    )
  }
}
export default NovoProjeto;
