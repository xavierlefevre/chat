// @flow
import { client } from '../app';
import { SET_CURRENT_USER, LOGOUT } from './constants';

export const setCurrentUser = (user: UserType) => ({
  type: SET_CURRENT_USER,
  user,
});

export const logout = () => {
  client.resetStore();
  return { type: LOGOUT };
};
