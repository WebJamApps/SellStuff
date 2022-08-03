import React, { Dispatch } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import mapStoreToProps, { Auth } from '../../redux/mapStoreToProps';
import { DrawerContainer } from './DrawerContainer';

interface AppMainProps extends RouteComponentProps {
  children: React.ReactNode;
  auth: Auth;
  dispatch: Dispatch<unknown>;
}

interface AppMainState { menuOpen: boolean, containerOpen: boolean }
export class AppTemplate extends React.Component<AppMainProps, AppMainState> {
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
      <div className={`${style2} container`}>
        {/* {this.drawerContainer(style)} */}
        <DrawerContainer 
          auth={this.props.auth} menuOpen={menuOpen} state={this.state} setState={this.setState} dispatch={this.props.dispatch}
        />
        {children}
      </div>
    );
  }
}

export default withRouter(connect(mapStoreToProps, null)(AppTemplate));
