import type { Iblog } from '../mapStoreToProps';

const initialState = { blogs: [] };

export const sortBlogs = (blogs?:Iblog[]) => {
  if (!Array.isArray(blogs)) return [];
  return blogs.sort((a, b) => {
    const aTime = new Date(a.created_at).getTime();
    const bTime = new Date(b.created_at).getTime();
    if (aTime > bTime) return -1;
    if (aTime < bTime) return 1;
    return 0;
  });
};

// TODO refactor to a Provider here instead of using Redux
// eslint-disable-next-line @typescript-eslint/default-param-last
const reducer = (state = initialState, action: { type: string; data: Iblog[]; }): { blogs:Iblog[] } => {
  switch (action.type) {
    case 'GOT_BLOGS':
      return {
        ...state,
        blogs: sortBlogs(action.data),
      };
    default:
      return state;
  }
};

export default reducer;
