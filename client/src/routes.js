// @flow
import React from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Groups from './pages/groups/groups.container';
import NewGroup from './pages/new-group/new-group.container';
import Messages from './pages/messages/messages.container';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  tabBarStyle: {
    backgroundColor: '#dbdbdb',
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

type TestScenePropsType = { title: string };

const TestScene = (props: TestScenePropsType) => (
  <View style={styles.container}>
    <Text>
      {props.title}
    </Text>
  </View>
);

type TabIconPropsType = {
  selected: boolean,
  title: string,
};

const TabIcon = (props: TabIconPropsType) => (
  <View style={styles.container}>
    <Text style={[styles.tabText, props.selected ? styles.selected : undefined]}>
      {props.title}
    </Text>
  </View>
);

export const Scenes = Actions.create(
  <Scene key="root">
    <Scene key="tabs" tabBarStyle={styles.tabBarStyle} tabs>
      <Scene key="chatsTab" title="Chats" icon={TabIcon}>
        <Scene key="groups" component={Groups} title="Chats" />
      </Scene>
      <Scene key="settingsTab" title="Settings" icon={TabIcon}>
        <Scene key="settings" component={TestScene} title="Settings" />
      </Scene>
    </Scene>
    <Scene key="newGroup" direction="vertical">
      <Scene key="newGroupModal" component={NewGroup} title="New Group" schema="modal" panHandlers={null} />
    </Scene>
    <Scene key="messages" component={Messages} />
  </Scene>
);

export const Routes = connect()(Router);
