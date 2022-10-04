import superagent from 'superagent';
import type { GoogleBody } from '../AppTypes';

export const gotToken = (doc: string): unknown => ({
  type: 'GOT_TOKEN',
  data: doc,
});

export const authError = (e: Error): unknown => ({
  type: 'AUTH_ERROR',
  error: e,
});

// export const logout = (dispatch: Dispatch<unknown>): void => dispatch({ type: 'LOGOUT' });

export async function authenticate(body: GoogleBody, auth:any, dispatch:(arg0:any)=>void): Promise<string> {
  if (auth.isAuthenticated) return 'authenticated';
  let data;
  try {
    data = await superagent.post(`${process.env.BackendUrl}/user/auth/google`)
      .set({ Accept: 'application/json' }).send(body);
  } catch (e: any) {
    dispatch(authError(e));
    return Promise.reject(e);
  }
  if (!data.body) {
    dispatch(authError(new Error('authentication failed')));
    return 'authentication failed';
  }
  dispatch(gotToken(data.body));
  return data.body.token;
}

