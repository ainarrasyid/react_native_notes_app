import {StackScreenPropsType} from '@models/navigators';
import React from 'react';
import {Text, View} from 'react-native';

function AddNote({navigation, route}: StackScreenPropsType<'AddNotes'>) {
  return (
    <View>
      <Text>add</Text>
    </View>
  );
}

export default AddNote;
