// @flow
import Immutable from 'seamless-immutable';
import { REHYDRATE } from 'redux-persist/constants';

import { LOGOUT, SET_CURRENT_USER } from './auth.constants';

const initialState = Immutable({
  loading: true,
  id: null,
  jwt: null,
  username: '',
});

const authReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case REHYDRATE:
      // convert persisted data to Immutable and confirm rehydration
      return Immutable(action.payload.auth || state).set('loading', false);
    case SET_CURRENT_USER:
      return state.merge(action.user);
    case LOGOUT:
      return state.merge({
        id: null,
        jwt: null,
      });
    default:
      return state;
  }
};

export default authReducer;
