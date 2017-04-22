import React, { Component, PropTypes } from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  tabText: {
    color: '#777',
    fontSize: 10,
    justifyContent: 'center',
  },
  selected: {
    color: 'blue',
  },
});

const TestScene = props => (
  <View style={styles.container}>
    <Text>
      {props.title}
    </Text>
  </View>
);

// icons for our Tab Scene
class TabIcon extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.tabText, this.props.selected ? styles.selected : undefined]}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}
TabIcon.propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

// create scenes via Actions.create() or it will be re-created every time Router renders
export const Scenes = Actions.create(
  <Scene key="root">
    <Scene key="tabs" tabs>
      <Scene key="chatsTab" title="Chats" icon={TabIcon}>
        <Scene
          key="groups"
          component={TestScene}
          title="Chats"
        />
      </Scene>
      <Scene key="settingsTab" title="Settings" icon={TabIcon}>
        <Scene
          key="settings"
          component={TestScene}
          title="Settings"
        />
      </Scene>
    </Scene>
  </Scene>,
);

export const Routes = connect()(Router);
