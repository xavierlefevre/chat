// @flow
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    backgroundColor: '#f5f1ee',
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#dbdbdb',
    borderRadius: 15,
    borderWidth: 1,
    color: 'black',
    height: 32,
    paddingHorizontal: 8,
  },
  sendButtonContainer: {
    paddingRight: 12,
    paddingVertical: 6,
  },
  sendButton: {
    height: 32,
    width: 32,
  },
  iconStyle: {
    marginRight: 0, // default is 12
  },
});
