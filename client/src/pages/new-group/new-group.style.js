// @flow
import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 64 : 54, // nav bar height
    flex: 1,
  },
  selected: {
    flexDirection: 'row',
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
});

export const sectionHeaderStyles = StyleSheet.create({
  view: {
    backgroundColor: '#ccc',
  },
  text: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
