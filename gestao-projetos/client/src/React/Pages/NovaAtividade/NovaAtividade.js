import React, { Component, Fragment } from 'react';
import Header from '../../Header/Header';
import Body from '../../Body/NovaAtividade/NovaAtividade';
import Footer from '../../Footer/Footer';


class NovaAtividade extends Component {
  render() {
    return (
      <Fragment>
        <Header title="Nova Atividade"/>
        <Body />
        <Footer />
      </Fragment>
    )
  }
}
export default NovaAtividade;
