// @flow
export { default as authReducer } from './auth/auth.reducer';
export { logoutAction, setCurrentUserAction } from './auth/auth.actions';

export { default as peopleReducer } from './people/people.reducer';
export { togglePrompt } from './people/people.actions';
