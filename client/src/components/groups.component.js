import React, { Component, PropTypes } from 'react';
import {
  ActivityIndicator,
  ListView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import Group from './group.component';

const styles = StyleSheet.create({
  container: {
    marginBottom: 50, // tab bar height
    marginTop: Platform.OS === 'ios' ? 64 : 54, // nav bar height
    flex: 1,
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
});

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && nextProps.user !== this.props.user) {
      // convert groups Array to ListView.DataSource
      // we will use this.state.ds to populate our ListView
      this.setState({
        // cloneWithRows computes a diff and decides whether to rerender
        ds: this.state.ds.cloneWithRows(nextProps.user.groups),
      });
    }
  }

  goToMessages(group) {
    Actions.messages({ groupId: group.id, title: group.name });
  }

  render() {
    const { loading } = this.props;

    // render loading placeholder while we fetch messages
    if (loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    // render list of groups for user
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          dataSource={this.state.ds}
          renderRow={group => (
            <Group
              group={group}
              goToMessages={() => this.goToMessages(group)}
            />
          )}
        />
      </View>
    );
  }
}

Groups.propTypes = {
  loading: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default Groups;
