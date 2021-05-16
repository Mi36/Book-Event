import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

export default function Input(props) {
  return (
    <TextInput
      {...props}
      autoCapitalize="none"
      style={styles.textInput}
      value={props.value}
      onChangeText={props.onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 2,
    borderColor: 'black',
    marginVertical: 10,
    height: 60,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
