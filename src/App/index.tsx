import superagent from 'superagent';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import commonUtils from '../lib/commonUtils';
import AdminDashboardDefault from '../containers/AdminDashboard';
import AppFourOhFour from './404';
import AppTemplateDefault from './AppTemplate';
import DefaultHomepage from '../containers/Homepage';
import mapStoreToProps from '../redux/mapStoreToProps';
import fetch from '../lib/fetch';
import { AppProps } from './AppTypes';

export class App extends Component<AppProps> {
  fetch: typeof fetch;

  superagent: superagent.SuperAgentStatic;

  static defaultProps = {
    dispatch: /* istanbul ignore next */(): void => { },
    auth: {
      isAuthenticated: false,
      user: { userType: '' },
      error: '',
      email: '',
      token: '',
    },
  };

  constructor(props: AppProps) {
    super(props);
    this.fetch = fetch;
    this.state = {};
    this.superagent = superagent;
  }

  componentDidMount(): void { // fetch the blogs to populate homepage content
    this.fetch.fetchGet(this, 'blog/', 'GOT_BLOGS');
  }

  render(): JSX.Element {
    const { auth } = this.props;
    const userRoles: string[] = commonUtils.getUserRoles();
    return (
      <React.StrictMode>
        <div id="App" className="App">
          <Router>
            <GoogleOAuthProvider clientId={process.env.GoogleClientId || ''}>
              <AppTemplateDefault>
                <Switch>
                  <Route exact path="/" component={DefaultHomepage} />
                  {auth.isAuthenticated && auth.user.userType && userRoles.indexOf(auth.user.userType) !== -1
                    ? <Route path="/admin" component={AdminDashboardDefault} /> : null}
                  <Route path="/_id" component={DefaultHomepage} />
                  <Route component={AppFourOhFour} />
                </Switch>
              </AppTemplateDefault>
            </GoogleOAuthProvider>
          </Router>
        </div>
      </React.StrictMode>
    );
  }
}

export default connect(mapStoreToProps, null)(App);
