/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { Homepage } from '../../../src/containers/Homepage';
import BlogEditor from '../../../src/components/BlogEditor';

const testBlogs = [
  { _id: '1', title: 'title1', body: 'body1' }, { _id: '2', title: 'title2', body: 'body2' }, {
    _id: '3', title: 'title3', body: 'body3', created_at: '1/11/1111',
  },
  { _id: 'badBlog' },
];
const wrapper = shallow<Homepage>(<Homepage blogs={testBlogs} auth={{ isAuthenticated: false }} />);

describe('Home', () => {
  it('renders snapshot correctly', () => { expect(wrapper).toMatchSnapshot(); });
  it('renders when authenticated and clicks button to deleteBlog', () => {
    const wrapper2 = shallow<Homepage>(<Homepage
      blogs={testBlogs}
      auth={{ isAuthenticated: true, user: { userType: 'good' } }}
    />);
    wrapper2.instance().deleteBlog = jest.fn();
    wrapper2.find('#deleteBlogButton1').simulate('click');
    expect(wrapper2.instance().deleteBlog).toHaveBeenCalledWith('1');
  });
  it('renders when authenticated and clicks button to editBlog', () => {
    const wrapper2 = shallow<Homepage>(<Homepage
      blogs={testBlogs}
      auth={{ isAuthenticated: true, user: { userType: 'good' } }}
    />);
    const testBlog:any = { _id: '123' };
    const editButton = wrapper2.instance().editBlogButton(testBlog);
    editButton.props.onOpen();
    expect(wrapper2.contains(<BlogEditor editBlog={testBlog} comp={wrapper2.instance()} />)).toBe(true);
  });
  it('deleteBlog successfully', async () => {
    const saDelete:any = jest.fn(() => ({ set: () => ({ set: () => Promise.resolve({ status: 200 }) }) }));
    wrapper.instance().superagent.delete = saDelete;
    const r = await wrapper.instance().deleteBlog('1');
    expect(r).toBe('200');
  });
  it('deleteBlog catch  error', async () => {
    const saDelete:any = jest.fn(() => ({ set: () => ({ set: () => Promise.reject(new Error('bad')) }) }));
    wrapper.instance().superagent.delete = saDelete;
    const r = await wrapper.instance().deleteBlog('1');
    expect(r).toBe('bad');
  });
  it('deleteBlog returns wrong status', async () => {
    const saDelete:any = jest.fn(() => ({ set: () => ({ set: () => Promise.resolve({ status: 400 }) }) }));
    wrapper.instance().superagent.delete = saDelete;
    const r = await wrapper.instance().deleteBlog('1');
    expect(r).toBe('Failed to delete blog, ');
  });
  it('deleteBlog returns wrong status with message', async () => {
    const saDelete:any = jest.fn(() => ({ set: () => ({ set: () => Promise.resolve({ status: 400, body: { message: 'id does not exist' } }) }) }));
    wrapper.instance().superagent.delete = saDelete;
    const r = await wrapper.instance().deleteBlog('1');
    expect(r).toBe('Failed to delete blog, id does not exist');
  });
  it('handleEditorChange', () => {
    wrapper.instance().setState = jest.fn();
    wrapper.update();
    wrapper.instance().handleEditorChange('howdy');
    expect(wrapper.instance().setState).toHaveBeenCalledWith({ editBlog: { body: 'howdy', _id: '', title: '' } });
  });
  it('redirects to /admin', () => {
    wrapper.setState({ referrer: '/admin#test' });
    expect(wrapper.find(Redirect).length).toBe(1);
  });
  it('renders blogNotFound', () => {
    const wrapper3 = shallow<Homepage>(<Homepage
      blogs={[]}
      auth={{ isAuthenticated: false }}
    />);
    expect(wrapper3.find('p.blog__entry--no-blogs').exists()).toBe(true);
  });
  it('renders when authenticated and clicks button to addBlog', () => {
    const wrapper2 = shallow<Homepage>(<Homepage
      blogs={testBlogs}
      auth={{ isAuthenticated: true, user: { userType: 'good' } }}
    />);
    wrapper2.find('#addBlogButton').at(1).simulate('click');
    expect(wrapper2.instance().state).toStrictEqual({
      editBlog: {
        _id: '',
        body: '',
        title: '',
      },
      referrer: '/admin#admin-top',
    });
  });
  it('blog id defined for and scroll to blog', () => {
    const scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    document.body.innerHTML = '<div id="production"></div>';
    const params = new URLSearchParams('?id=production');
    expect(params.get('id')).toBeDefined();
    wrapper.instance().checkBlogId(params);
  });
  it('blog id not defined for blog', () => {
    document.body.innerHTML = '<div></div>';
    const params = new URLSearchParams();
    expect(params.get('id')).toBe(null);
    wrapper.instance().checkBlogId(params);
  });
});
