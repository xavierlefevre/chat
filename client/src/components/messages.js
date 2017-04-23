import { _ } from 'lodash';
import { ListView, Platform, StyleSheet, View } from 'react-native';
import React, { Component, PropTypes } from 'react';
import randomColor from 'randomcolor';

import Message from './message';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#e5ddd5',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 64,
  },
  loading: {
    justifyContent: 'center',
  },
  titleWrapper: {
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 15,
      },
      android: {
        top: 5,
      },
    }),
    left: 0,
    right: 0,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleImage: {
    marginRight: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

const fakeData = () => _.times(100, i => ({
  // every message will have a different color
  color: randomColor(),
  // every 5th message will look like it's from the current user
  isCurrentUser: i % 5 === 0,
  message: {
    id: i,
    createdAt: new Date().toISOString(),
    from: {
      username: `Username ${i}`,
    },
    text: `Message ${i}`,
  },
}));

export class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView
        .DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        .cloneWithRows(fakeData()),
    };
  }

  render() {
    // render list of messages for group
    return (
      <View style={styles.container}>
        <ListView
          style={styles.listView}
          enableEmptySections
          dataSource={this.state.ds}
          renderRow={({ isCurrentUser, message, color }) => (
            <Message
              color={color}
              isCurrentUser={isCurrentUser}
              message={message}
            />
          )}
        />
      </View>
    );
  }
}

Messages.propTypes = {
  groupId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default Messages;
