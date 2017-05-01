// @flow
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cellContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cellImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  cellLabel: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  checkButtonContainer: {
    paddingRight: 12,
    paddingVertical: 6,
  },
  checkButton: {
    borderWidth: 1,
    borderColor: '#dbdbdb',
    padding: 4,
    height: 24,
    width: 24,
  },
  checkButtonIcon: {
    marginRight: -4, // default is 12
  },
});
