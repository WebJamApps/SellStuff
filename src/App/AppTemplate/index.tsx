import { Dispatch, Component, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Box, AppBar, Toolbar, Typography, Button,
} from '@mui/material';
import mapStoreToProps, { Auth } from 'src/redux/mapStoreToProps';
import { DrawerContainer } from './DrawerContainer';
import AppMenu from './AppMenu';

interface AppMainProps extends RouteComponentProps {
  children: React.ReactNode;
  auth: Auth;
  dispatch: Dispatch<unknown>;
}

interface AppMainState { menuOpen: boolean, containerOpen: boolean }
export class AppTemplate extends Component<AppMainProps, AppMainState> {
  static defaultProps = {
    dispatch: /* istanbul ignore next */(): void => { },
    auth: {
      isAuthenticated: false, user: { userType: '' }, email: '', error: '', token: '',
    },
  };

  constructor(props: AppMainProps) {
    super(props);
    this.state = { menuOpen: false, containerOpen: true };
  }

  render(): JSX.Element {
    const { menuOpen, containerOpen } = this.state;
    // const style = `${menuOpen ? 'open' : 'close'}`;
    const style2 = `${containerOpen ? 'open' : 'close'}`;
    const { children } = this.props;
    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <AppMenu />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Home
              </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
        </Box>
        <div className={`${style2} container`}>
          <DrawerContainer
            auth={this.props.auth}
            menuOpen={menuOpen}
            state={this.state}
            setState={this.setState}
            dispatch={this.props.dispatch}
          />
          {children}
        </div>
      </div>

    );
  }
}

export default withRouter(connect(mapStoreToProps, null)(AppTemplate));
