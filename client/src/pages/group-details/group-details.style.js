// @flow
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupImageContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 6,
    alignItems: 'center',
  },
  groupName: {
    color: 'black',
  },
  groupNameBorder: {
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    flex: 1,
    paddingVertical: 8,
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  participants: {
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: '#dbdbdb',
    color: '#777',
  },
  user: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    flexDirection: 'row',
    padding: 10,
  },
  username: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
