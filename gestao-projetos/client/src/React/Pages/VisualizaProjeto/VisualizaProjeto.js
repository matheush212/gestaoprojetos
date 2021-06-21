import React, { Component, Fragment } from 'react';
import Header from '../../Header/Header';
import Body from '../../Body/VisualizaProjeto/VisualizaProjeto';
import Footer from '../../Footer/Footer';


class VisualizaProjeto extends Component {
  render() {
    return (
      <Fragment>
        <Header title="Projeto"/>
        <Body />
        <Footer />
      </Fragment>
    )
  }
}
export default VisualizaProjeto;
