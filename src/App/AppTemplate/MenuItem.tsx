import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Tooltip, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import authUtils from 'src/App/AppTemplate/authUtils';
import { Auth } from '../../redux/mapStoreToProps';
import commonUtils from '../../lib/commonUtils';
import { ImenuDefinition } from './menuDefinition';

interface IgoogleButtonsProps {
  type: string, index: string | number | undefined,
  auth: any, dispatch: (arg0: any) => void,
}

function GoogleButtons(props: IgoogleButtonsProps): JSX.Element {
  const {
    type, index, auth, dispatch,
  } = props;
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => authUtils.responseGoogleLogin(codeResponse, auth, dispatch),
    onError: () => console.log('Google login failed'),
    flow: 'auth-code',
  });
  if (type === 'login') {
    return (
      <Tooltip key={index} title="Login with your Google account">
        <div key={index} className="menu-item googleLogin">
          <Button onClick={login}>
            Login
          </Button>
        </div>
      </Tooltip>
    );
  } return (
    <div key={index} className="menu-item googleLogout">
      <Button onClick={() => { authUtils.responseGoogleLogout(dispatch); }}>
        Logout
      </Button>
    </div>
  );
}

function close(setState: (ar0: any) => void): boolean {
  setState({ menuOpen: false, containerOpen: true });
  return true;
}

function MenuLink(props: any): JSX.Element {
  const { menu, index, setState } = props;
  return (
    <div key={index} className="nav">
      <Link to={menu.link} className="nav__link" onClick={() => close(setState)}>
        <i className={`${menu.iconClass}`} />
        &nbsp;
        <span className="nav-item">{menu.name}</span>
      </Link>
    </div>
  );
}

const continueMenuItem = (
  menu: ImenuDefinition,
  index: number,
  auth: Auth,
  setState: (arg0: any) => void,
  dispatch: (arg0: any) => void,
): JSX.Element | null => {
  if (menu.link !== '') return <MenuLink menu={menu} index={index} setState={setState} />;
  if (menu.type === 'googleLogin' && !auth.isAuthenticated) return <GoogleButtons auth={auth} dispatch={dispatch} type="login" index={index} />;
  if (menu.type === 'googleLogout' && auth.isAuthenticated) return <GoogleButtons auth={auth} dispatch={dispatch} type="logout" index={index} />;
  return null;
};

interface ImenuItemProps {
  menuItem: ImenuDefinition, index: number, auth: any, setState: (arg0: any) => void, dispatch: (arg0: any) => void
}

export function MenuItem(props: ImenuItemProps): JSX.Element | null {
  const {
    menuItem, auth, index, setState, dispatch,
  } = props;
  const userRoles: string[] = commonUtils.getUserRoles();
  // const { auth } = view.props;
  if (menuItem.name === 'Home' && window.location.pathname === '/') return null;
  if (menuItem.name === 'Admin' && (!auth.isAuthenticated || !auth.user.userType || userRoles.indexOf(auth.user.userType) === -1)) return null;
  return continueMenuItem(menuItem, index, auth, setState, dispatch);
}

