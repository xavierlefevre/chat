// @flow
/* eslint-disable no-undef */
declare type NavigationPropsType = {
  navigate: string => void,
  goBack: () => void,
  setParams: ({}) => void,
  dispatch: () => void,
  state: {
    params: {},
  },
};
