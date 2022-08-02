import React from 'react';
import { Auth } from '../../redux/mapStoreToProps';
import commonUtils from '../../lib/commonUtils';
import { ImenuDefinition } from './menuDefinition';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import authUtils from './authUtils';

// function responseGoogleLogin(
//   response: GoogleLoginResponseOffline | GoogleLoginResponse,
//   auth:any, dispatch:(arg0:any)=>void,
// ): Promise<string> {
//   return authUtils.responseGoogleLogin(response, auth, dispatch);
// }

function responseGoogleLogout(dispatch:(arg0:any)=>void): string { return authUtils.responseGoogleLogout(dispatch); }

interface IgoogleButtonsProps {
  type: string, index: string | number | undefined,
  auth:any, dispatch:(arg0:any)=>void,
}
function GoogleButtons(props:IgoogleButtonsProps): JSX.Element {
  const { type, index, auth, dispatch } = props;
  const cId = process.env.GoogleClientId || /* istanbul ignore next */'';
  if (type === 'login') {
    return (
      <Tooltip key={index} title={'Login with your Google account'} >
      <div key={index} className="menu-item googleLogin">
        <GoogleLogin
          responseType="code"
          clientId={cId}
          icon={false}
          className="googleLoginButton"
          buttonText="Login"
          accessType="offline"
          onSuccess={(response:any)=> authUtils.responseGoogleLogin(response, auth, dispatch)}
          onFailure={authUtils.responseGoogleFailLogin}
          cookiePolicy="single_host_origin"
        >
          <i className="fab fa-google"> Login</i>
        </GoogleLogin>
      </div>
      </Tooltip>
    );
  } return (
    <div key={index} className="menu-item googleLogout">
      <GoogleLogout className="googleLogoutButton" clientId={cId} icon={false} buttonText="Logout" 
      onLogoutSuccess={()=>responseGoogleLogout(dispatch)}>
        <i className="fab fa-google"> Logout</i>
      </GoogleLogout>
    </div>
  );
}

function close(setState:(ar0:any)=>void): boolean {
  setState({ menuOpen: false, containerOpen: true });
  return true;
}

function MenuLink(props:any): JSX.Element {
  const { menu, index, setState } = props;
  return (
    <div key={index} className="nav">
      <Link to={menu.link} className="nav__link" onClick={()=> close(setState)}>
        <i className={`${menu.iconClass}`} />
        &nbsp;
        <span className="nav-item">{menu.name}</span>
      </Link>
    </div>
  );
}

const continueMenuItem = (
  menu: ImenuDefinition,
  index: number, auth: Auth,
  setState:(arg0:any)=>void,
  dispatch:(arg0:any)=>void,
): JSX.Element | null => {
  if (menu.link !== '') return <MenuLink menu={menu} index={index} setState={setState}/>;
  if (menu.type === 'googleLogin' && !auth.isAuthenticated) return <GoogleButtons auth={auth} dispatch={dispatch} type="login" index={index}/>;
  if (menu.type === 'googleLogout' && auth.isAuthenticated) return <GoogleButtons auth={auth} dispatch={dispatch} type="logout" index={index}/>;
  return null;
};

interface ImenuItemProps {
  menuItem: ImenuDefinition, index: number, auth:any, setState:(arg0:any)=>void, dispatch:(arg0:any)=>void
}
export function MenuItem(props: ImenuItemProps): JSX.Element | null {
  const { menuItem, auth, index, setState, dispatch } = props;
  const userRoles: string[] = commonUtils.getUserRoles();
  // const { auth } = view.props;
  if (menuItem.name === 'Home' && window.location.pathname === '/') return null;
  if (menuItem.name === 'Admin' && (!auth.isAuthenticated || !auth.user.userType || userRoles.indexOf(auth.user.userType) === -1)) return null;
  return continueMenuItem(menuItem, index, auth, setState, dispatch);
}

