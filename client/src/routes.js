// @flow
import React from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { Groups } from 'ChatApp/src/pages/groups';
import { NewGroup } from 'ChatApp/src/pages/new-group';
import { Messages } from 'ChatApp/src/pages/messages';
import { FinalizeGroup } from 'ChatApp/src/pages/finalize-group';
import { GroupDetails } from 'ChatApp/src/pages/group-details';
import { Signin } from 'ChatApp/src/pages/signin';
import { Settings } from 'ChatApp/src/pages/settings';

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
        <Scene key="groups" component={Groups} title="Chats" hideBackImage />
      </Scene>
      <Scene key="settingsTab" title="Settings" icon={TabIcon}>
        <Scene key="settings" component={Settings} title="Settings" hideBackImage />
      </Scene>
    </Scene>
    <Scene key="signin" direction="vertical">
      <Scene key="signinModal" component={Signin} title="Chatty" schema="modal" panHandlers={null} />
    </Scene>
    <Scene key="newGroup" direction="vertical">
      <Scene key="newGroupModal" component={NewGroup} title="New Group" schema="modal" panHandlers={null} />
      <Scene key="finalizeGroup" component={FinalizeGroup} title="New Group" />
    </Scene>
    <Scene key="messages" component={Messages} />
    <Scene key="groupDetails" component={GroupDetails} title="Group Info" />
  </Scene>
);

export const Routes = connect()(Router);
