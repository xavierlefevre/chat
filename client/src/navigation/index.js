// @flow
import React from 'react';
import { addNavigationHelpers, StackNavigator, TabNavigator, NavigationActions, TabBarBottom } from 'react-navigation';
import { connect } from 'react-redux';
import { REHYDRATE } from 'redux-persist/constants';

import { Groups, NewGroup, Messages, FinalizeGroup, GroupDetails, Signin, Settings, People } from 'ChatApp/src/pages';
import { LOGOUT } from 'ChatApp/src/redux/auth/auth.constants';

// tabs in main screen
const MainScreenNavigator = TabNavigator(
  {
    Chats: { screen: Groups },
    People: { screen: People },
    Settings: { screen: Settings },
  },
  {
    tabBarPosition: 'bottom',
    tabBarComponent: TabBarBottom,
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true,
      labelStyle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 18,
      },
    },
  }
);

const AppNavigator = StackNavigator(
  {
    Main: { screen: MainScreenNavigator },
    Signin: { screen: Signin },
    Messages: { screen: Messages },
    GroupDetails: { screen: GroupDetails },
    NewGroup: { screen: NewGroup },
    FinalizeGroup: { screen: FinalizeGroup },
  },
  {
    mode: 'modal',
  }
);

// reducer initialization code
const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const initialNavState = AppNavigator.router.getStateForAction(tempNavState);

type StateType = {
  routes: Array<{ routeName: string }>,
  index: number,
};

type ActionType = {
  type: string,
  payload: {
    auth: {
      jwt: string,
    },
  },
};

// reducer code
export const navigationReducer = (state: StateType = initialNavState, action: ActionType) => {
  let nextState;
  switch (action.type) {
    case REHYDRATE: {
      // convert persisted data to Immutable and confirm rehydration
      if (!action.payload.auth || !action.payload.auth.jwt) {
        const { routes, index } = state;
        if (routes[index].routeName !== 'Signin') {
          nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Signin' }), state);
        }
      }
      break;
    }
    case LOGOUT: {
      const { routes, index } = state;
      if (routes[index].routeName !== 'Signin') {
        nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Signin' }), state);
      }
      break;
    }
    default: {
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
    }
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

type PropsType = {
  dispatch: () => void,
  nav: {},
};

const AppWithNavigationState = ({ dispatch, nav }: PropsType) =>
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />;

const mapStateToProps = ({ auth, nav }) => ({ auth, nav });

export default connect(mapStateToProps)(AppWithNavigationState);
