import React, { Component, Fragment } from 'react';
import Header from '../../Header/Header';
import Body from '../../Body/VisualizaAtividade/VisualizaAtividade';
import Footer from '../../Footer/Footer';


class VisualizaAtividade extends Component {
  render() {
    return (
      <Fragment>
        <Header title="Atividade"/>
        <Body />
        <Footer />
      </Fragment>
    )
  }
}
export default VisualizaAtividade;
