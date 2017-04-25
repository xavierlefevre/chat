import { _ } from 'lodash';
import { ActivityIndicator, KeyboardAvoidingView, ListView, Platform, StyleSheet, View } from 'react-native';
import React, { Component, PropTypes } from 'react';
import randomColor from 'randomcolor';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import Message from './message';
import MessageInput from './message-input';
import GROUP_QUERY from '../queries/group.query';
import CREATE_MESSAGE_MUTATION from '../queries/createMessage.mutation';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#e5ddd5',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 32,
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

export class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      usernameColors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldData = this.props;
    const newData = nextProps;
    const usernameColors = {};
    // check for new messages
    if (newData.group) {
      if (newData.group.users) {
        // apply a color to each user
        newData.group.users.map((user) => {
          usernameColors[user.username] = this.state.usernameColors[user.username] || randomColor();
        });
      }
      if (!!newData.group.messages &&
        (!oldData.group || newData.group.messages !== oldData.group.messages)) {
        // convert messages Array to ListView.DataSource
        // we will use this.state.ds to populate our ListView
        this.setState({
          ds: this.state.ds.cloneWithRows(
            // reverse the array so newest messages
            // show up at the bottom
            newData.group.messages.slice().reverse(),
          ),
          usernameColors,
        });
      }
    }
  }

  send(text) {
    this.props.createMessage({
      groupId: this.props.groupId,
      userId: 1, // faking the user for now
      text,
    });
  }

  render() {
    const { loading, group } = this.props;
    // render loading placeholder while we fetch messages
    if (loading && !group) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    // render list of messages for group
    return (
      <KeyboardAvoidingView
        behavior={'position'}
        contentContainerStyle={styles.container}
        style={styles.container}
      >
        <ListView
          style={styles.listView}
          enableEmptySections
          dataSource={this.state.ds}
          renderRow={message => (
            <Message
              color={this.state.usernameColors[message.from.username]}
              message={message}
              isCurrentUser={message.from.id === 1} // for now until we implement auth
            />
          )}
        />
        <MessageInput send={text => this.send(text)} />
      </KeyboardAvoidingView>
    );
  }
}

Messages.propTypes = {
  group: PropTypes.shape({
    messages: PropTypes.array,
    users: PropTypes.array,
  }),
  loading: PropTypes.bool,
  groupId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  createMessage: PropTypes.func,
};

const groupQuery = graphql(GROUP_QUERY, {
  options: ({ groupId }) => ({ variables: { groupId } }),
  props: ({ data: { loading, group } }) => ({
    loading, group,
  }),
});

function isDuplicateMessage(newMessage, existingMessages) {
  return newMessage.id !== null &&
    existingMessages.some(message => newMessage.id === message.id);
}

const createMessage = graphql(CREATE_MESSAGE_MUTATION, {
  props: ({ mutate }) => ({
    createMessage: ({ text, userId, groupId }) =>
      mutate({
        variables: { text, userId, groupId },
        updateQueries: {
          group: (previousResult, { mutationResult }) => {
            const newMessage = mutationResult.data.createMessage;
            if (isDuplicateMessage(newMessage,
                previousResult.group.messages)) {
              return previousResult;
            }
            return update(previousResult, {
              group: {
                messages: {
                  $unshift: [newMessage],
                },
              },
            });
          },
        },
      }),
  }),
});

export default compose(
  groupQuery,
  createMessage,
)(Messages);
