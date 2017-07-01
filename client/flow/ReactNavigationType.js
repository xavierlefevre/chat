// @flow
/* eslint-disable no-undef */
declare module 'react-navigation' {
  declare var addNavigationHelpers: () => void;
  declare var StackNavigator: () => ReactClass<any>;
  declare var TabBarBottom: () => ReactClass<any>;
  declare var TabNavigator: () => void;
  declare var NavigationActions: () => void;
}
