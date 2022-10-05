import superagent from 'superagent';
import jwt from 'jsonwebtoken';
import type { Dispatch } from 'react';
import { googleLogout } from '@react-oauth/google';
import commonUtils from 'src/lib/commonUtils';
import { authenticate } from './authActions';
import type { GoogleBody } from '../AppTypes';
import utils from '../../lib/commonUtils';

async function responseGoogleLogout(dispatch: Dispatch<unknown>): Promise<string> {
  dispatch({ type: 'LOGOUT' });
  googleLogout();
  await commonUtils.delay(2);
  window.location.assign('/');
  return 'logout';
}

async function setUser(token:string, dispatch:(arg0:any)=>void): Promise<void> {
  const userRoles = commonUtils.getUserRoles();
  let decoded:any, user: superagent.Response;
  try {
    decoded = jwt.verify(token, process.env.HashString || /* istanbul ignore next */'');
    user = await superagent.get(`${process.env.BackendUrl}/user/${decoded.sub}`)
      .set('Accept', 'application/json').set('Authorization', `Bearer ${token}`);
    if (userRoles.indexOf(user.body.userType) === -1) {
      // console.log(user);
      await responseGoogleLogout(dispatch);
    } else dispatch({ type: 'SET_USER', data: user.body });
    window.location.reload();
  } catch (e: any) { console.log(`${e.message}`); }
}

async function responseGoogleLogin(
  response: any,
  auth:any,
  dispatch:(arg0:any)=>void,
): Promise<void> {
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
  try {
    const token = await authenticate(body, auth, dispatch);
    await setUser(token, dispatch);
  } catch (e: any) {
    console.log(`${e.message}`);
  }
}

function responseGoogleFailLogin(response: unknown): string {
  return `${response}`;
}

export default {
  responseGoogleLogin, responseGoogleLogout, responseGoogleFailLogin, setUser,
};
