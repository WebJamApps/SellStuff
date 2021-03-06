import superagent from 'superagent';
import jwt from 'jsonwebtoken';
import { Dispatch } from 'react';
import { GoogleLoginResponseOffline, GoogleLoginResponse } from 'react-google-login';
import commonUtils from '../lib/commonUtils';
import authenticate, { logout } from './authActions';
import { GoogleBody } from './AppTypes';
import type { AppTemplate } from './AppTemplate';

export interface AuthUtils {
  setUser: (view: AppTemplate) => Promise<string>,
  responseGoogleLogin: (response: GoogleLoginResponseOffline | GoogleLoginResponse, view: AppTemplate) => Promise<string>,
  responseGoogleFailLogin: (response: unknown) => string,
  responseGoogleLogout: (dispatch: Dispatch<unknown>) => string,
}
async function setUser(view: AppTemplate): Promise<string> {
  const { auth, dispatch } = view.props;
  const userRoles = commonUtils.getUserRoles();
  let decoded:any, user: superagent.Response, message = 'user set';
  try {
    decoded = jwt.verify(auth.token, process.env.HashString || /* istanbul ignore next */'');
  } catch (e: any) { return `${e.message}`; }
  if ((decoded && typeof decoded !== 'string') && (decoded.user && userRoles.indexOf(decoded.user.userType) !== -1)) {
    dispatch({ type: 'SET_USER', data: decoded.user });
  } else {
    try {
      user = await superagent.get(`${process.env.BackendUrl}/user/${decoded.sub}`)
        .set('Accept', 'application/json').set('Authorization', `Bearer ${auth.token}`);
      if (userRoles.indexOf(user.body.userType) === -1) {
        logout(dispatch); message = 'invalid userType';
      } else dispatch({ type: 'SET_USER', data: user.body });
    } catch (e: any) { return `${e.message}`; }
  }
  window.location.reload();
  return message;
}
async function responseGoogleLogin(response: GoogleLoginResponseOffline | GoogleLoginResponse, view: AppTemplate): Promise<string> {
  const uri = window.location.href;
  const baseUri = uri.split('/')[2];
  const body: GoogleBody = {
    clientId: process.env.GoogleClientId || /* istanbul ignore next */'',
    redirectUri: /* istanbul ignore next */process.env.NODE_ENV === 'production' ? `https://${baseUri}` : `http://${baseUri}`,
    code: `${response.code}`,
    /* istanbul ignore next */state() {
      const rand = Math.random().toString(36).substr(2);
      return encodeURIComponent(rand);
    },
  };
  try { await authenticate(body, view.props); } catch (e: any) {
    return `${e.message}`;
  }
  return setUser(view);
}

function responseGoogleFailLogin(response: unknown): string {
  return `${response}`;
}

function responseGoogleLogout(dispatch: Dispatch<unknown>): string {
  logout(dispatch);
  if (window.location.href.includes('/admin')) {
    window.location.assign('/staff');
    return 'assign';
  }
  window.location.reload(); return 'reload';
}

export default {
  responseGoogleLogin, responseGoogleLogout, responseGoogleFailLogin, setUser,
};
