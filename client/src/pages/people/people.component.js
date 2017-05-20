// @flow
import React from 'react';
import { View } from 'react-native';
import AlphabetListView from 'react-native-alphabetlistview';

import { SectionItem, Cell } from 'ChatApp/src/components';

import styles from './people.style';

export default () => (
  <View style={styles.container}>
    <AlphabetListView
      style={{ flex: 1 }}
      data={{
        m: { a: { username: 'maman' } },
        d: { a: { username: 'dad' } },
        s: { a: { username: 'sis' } },
      }}
      cell={Cell}
      cellHeight={30}
      sectionListItem={SectionItem}
      sectionHeaderHeight={22.5}
    />
  </View>
);
