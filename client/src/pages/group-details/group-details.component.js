// @flow
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import styles from './group-details.style';

type PropsType = {
  loading: boolean,
  group: GroupType,
  deleteGroup: () => Promise<any>,
  leaveGroup: () => Promise<any>,
  id: number,
  navigation: NavigationPropsType & {
    state: {
      params: {
        title: string,
        id: number,
      },
    },
  },
};

export default class GroupDetails extends Component {
  props: PropsType;

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });

  keyExtractor = (item: FriendType) => item.id;

  resetAction() {
    NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Main' })],
    });
  }

  deleteGroup() {
    this.props
      .deleteGroup(this.props.navigation.state.params.id)
      .then(() => {
        this.props.navigation.dispatch(this.resetAction);
      })
      .catch(e => {
        console.log(e); // eslint-disable-line no-console
      });
  }

  leaveGroup() {
    this.props
      .leaveGroup({
        id: this.props.navigation.state.params.id,
      })
      .then(() => {
        this.props.navigation.dispatch(this.resetAction);
      })
      .catch(e => {
        console.log(e); // eslint-disable-line no-console
      });
  }

  renderItem = ({ item: user }: { item: FriendType }) =>
    <View style={styles.user}>
      <Image
        style={styles.avatar}
        source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
      />
      <Text style={styles.username}>
        {user.username}
      </Text>
    </View>;

  render() {
    const { group, loading } = this.props;

    // render loading placeholder while we fetch messages
    if (!group || loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={group.users}
          keyExtractor={(item: FriendType) => this.keyExtractor(item)}
          renderItem={(item: { item: FriendType }) => this.renderItem(item)}
          ListHeaderComponent={() =>
            <View>
              <View style={styles.detailsContainer}>
                <TouchableOpacity
                  style={styles.groupImageContainer}
                  onPress={() => {}}
                >
                  <Image
                    style={styles.groupImage}
                    source={{
                      uri: 'https://facebook.github.io/react/img/logo_og.png',
                    }}
                  />
                  <Text>edit</Text>
                </TouchableOpacity>
                <View style={styles.groupNameBorder}>
                  <Text style={styles.groupName}>
                    {group.name}
                  </Text>
                </View>
              </View>
              <Text style={styles.participants}>
                {`participants: ${group.users.length}`.toUpperCase()}
              </Text>
            </View>}
          ListFooterComponent={() =>
            <View>
              <Button title={'Leave Group'} onPress={() => this.leaveGroup()} />
              <Button
                title={'Delete Group'}
                onPress={() => this.deleteGroup()}
              />
            </View>}
        />
      </View>
    );
  }
}
