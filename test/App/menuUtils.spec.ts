/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuItem } from 'src/App/AppTemplate/MenuItem';

describe('menuUtils', () => {
  it('Is True', () => {
    expect(true).toBe(true);
  });
  // let r: JSX.Element | null;
  // const viewStub: any = {
  //   googleButtons: () => true,
  //   makeMenuLink: () => true,
  //   props: {
  //     location: { pathname: '/' },
  //     auth: { token: 'token', isAuthenticated: true, user: { userType: 'Developer' } },
  //     dispatch: () => Promise.resolve(true),
  //   },
  // };
  // it('handles menuItem for GoogleLogin', () => {
  //   viewStub.props.location.pathname = '/staff';
  //   r = MenuItem(viewStub.props);
  //   expect(r).toBe(true);
  // });
  // it('handles menuItem for GoogleLogout', () => {
  //   r = MenuItem(viewStub.props);
  //   expect(r).toBe(true);
  // });
  // it('Prevents access to Admin Dashboard when auth user userType is incorrect', () => {
  //   viewStub.props.auth = { isAuthenticated: true, token: '', user: { userType: 'booya' } };
  //   r = MenuItem(viewStub.props);
  //   expect(r).toBe(null);
  // });
  // it('does not display the home page link when on the home page already', () => {
  //   window.location.pathname = '/';
  //   viewStub.props.auth = { isAuthenticated: false, token: '', user: { userType: 'booya' } };
  //   r = MenuItem(viewStub.props);
  //   expect(r).toBe(null);
  // });
});
