// @flow
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  message: {
    flex: 0.8,
    backgroundColor: 'white',
    borderRadius: 6,
    marginHorizontal: 16,
    marginVertical: 2,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
    },
  },
  myMessage: {
    backgroundColor: '#dcf8c6',
  },
  messageUsername: {
    color: 'red',
    fontWeight: 'bold',
    paddingBottom: 12,
  },
  messageTime: {
    color: '#8c8c8c',
    fontSize: 11,
    textAlign: 'right',
  },
  messageSpacer: {
    flex: 0.2,
  },
});
