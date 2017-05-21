// @flow
import Immutable from 'seamless-immutable';

import { TOGGLE_PROMPT } from './people.constants';

const initialState = Immutable({
  promptShown: false,
});

const peopleReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case TOGGLE_PROMPT:
      return state.merge({ promptShown: !state.promptShown });
    default:
      return state;
  }
};

export default peopleReducer;
