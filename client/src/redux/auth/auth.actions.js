// @flow
import { client } from 'ChatApp/src/app';
import { SET_CURRENT_USER, LOGOUT } from './auth.constants';

export const setCurrentUserAction = (user: UserType) => ({
  type: SET_CURRENT_USER,
  user,
});

export const logoutAction = () => {
  client.resetStore();
  return { type: LOGOUT };
};
