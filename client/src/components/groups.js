import { _ } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { ListView, Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    marginBottom: 50, // tab bar height
    marginTop: Platform.OS === 'ios' ? 64 : 54, // nav bar height
    flex: 1,
  },
  groupContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  groupName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
});

// create fake data to populate our ListView
const fakeData = () => _.times(100, i => ({
  id: i,
  name: `Group ${i}`,
}));

class Group extends Component {
  render() {
    const { id, name } = this.props.group;
    return (
      <TouchableHighlight
        key={id}
        onPress={this.props.goToMessages}
      >
        <View style={styles.groupContainer}>
          <Text style={styles.groupName}>{`${name}`}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

Group.propTypes = {
  goToMessages: PropTypes.func.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(fakeData()),
    };
  }

  goToMessages(group) {
    Actions.messages({ groupId: group.id, title: group.name });
  }

  render() {
    // render list of groups for user
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          dataSource={this.state.ds}
          renderRow={(group => (
            <Group group={group} goToMessages={() => this.goToMessages(group)} />
          ))}
        />
      </View>
    );
  }
}

export default Groups;
