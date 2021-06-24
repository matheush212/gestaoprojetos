import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.css';
import Autenticacao from './React/Pages/Autenticacao/Autenticacao';
import MeusProjetos from './React/Pages/MeusProjetos/MeusProjetos';
import NovoProjeto from './React/Pages/NovoProjeto/NovoProjeto';
import VisualizaProjeto from './React/Pages/VisualizaProjeto/VisualizaProjeto';
import MinhasAtividades from './React/Pages/MinhasAtividades/MinhasAtividades';
import VisualizaAtividade from './React/Pages/VisualizaAtividade/VisualizaAtividade';
import NovaAtividade from './React/Pages/NovaAtividade/NovaAtividade';
import AlteraPerfil from './React/Pages/AlteraPerfil/AlteraPerfil';
import AlteraSenha from './React/Pages/AlteraSenha/AlteraSenha';
import Informacoes from './React/Pages/Informacoes/Informacoes';

import NotAuthenticated from './React/Pages/NotAuthenticated/NotAuthenticated';
import NotFound from './React/Pages/NotFound/NotFound';
import AutenticacaoSession from './Autenticacao/AutenticacaoSession';

class PrivateRoute extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props)

    this.state = {
      result: true
    }
  }

  async componentDidMount() {
    this._isMounted = true;
    try {
      let apiValue = await AutenticacaoSession.Authorize();
      if (this._isMounted)
        this.setState({ result: apiValue });
    } catch (err) {
      console.log(err);
    }
  }

  async componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    try {
      let authorize = this.state.result;

      if (authorize)
        return <Route path={this.props.path} component={this.props.component} />;
      else
        return <Route path={this.props.path} component={NotAuthenticated} />;
    }
    catch (err) {
      console.log(err);
    }
  }
}


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path='/' exact={true} component={Autenticacao} />
      <PrivateRoute path="/MeusProjetos" component={MeusProjetos} />
      <PrivateRoute path="/NovoProjeto" component={NovoProjeto} />
      <PrivateRoute path="/VisualizaProjeto" component={VisualizaProjeto} />
      <PrivateRoute path="/MinhasAtividades" component={MinhasAtividades} />
      <PrivateRoute path="/VisualizaAtividade" component={VisualizaAtividade} />
      <PrivateRoute path="/NovaAtividade" component={NovaAtividade} />
      <PrivateRoute path="/AlteraPerfil" component={AlteraPerfil} />
      <PrivateRoute path="/AlteraSenha" component={AlteraSenha} />
      <PrivateRoute path="/Informacoes" component={Informacoes} />
      <Route path="/NotAuthenticated" component={NotAuthenticated} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)