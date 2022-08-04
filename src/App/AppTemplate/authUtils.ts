import superagent from 'superagent';
import jwt from 'jsonwebtoken';
import { Dispatch } from 'react';
import { googleLogout } from '@react-oauth/google';
import commonUtils from '../../lib/commonUtils';
import { authenticate } from './authActions';
import { GoogleBody } from '../AppTypes';
import utils from '../../lib/commonUtils';

async function responseGoogleLogout(dispatch: Dispatch<unknown>): Promise<string> {
  dispatch({ type: 'LOGOUT' });
  googleLogout();
  await utils.delay(2);
  window.location.assign('/'); 
  return 'logout';
}

async function setUser(auth:any, dispatch:(arg0:any)=>void): Promise<string> {
  const userRoles = commonUtils.getUserRoles();
  let decoded:any, user: superagent.Response;
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
        return await responseGoogleLogout(dispatch);
      } else dispatch({ type: 'SET_USER', data: user.body });
    } catch (e: any) { return `${e.message}`; }
  }
  window.location.reload();
  return 'user set';
}
async function responseGoogleLogin(
  response: any,
  auth:any, dispatch:(arg0:any)=>void,
): Promise<string> {
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
  try { await authenticate(body, auth, dispatch); } catch (e: any) {
    return `${e.message}`;
  }
  return setUser(auth, dispatch);
}

function responseGoogleFailLogin(response: unknown): string {
  return `${response}`;
}

export default {
  responseGoogleLogin, responseGoogleLogout, responseGoogleFailLogin, setUser,
};
