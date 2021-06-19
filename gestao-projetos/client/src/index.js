import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.css';
import Autenticacao from './React/Pages/Autenticacao/Autenticacao';

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
      <Route path="/NotAuthenticated" component={NotAuthenticated} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)