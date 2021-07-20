import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { theme } from '../core/theme'

const MyPicker = ({ errorText, description, ...props }) => (
  <View style={styles.container}>
    <View style={styles.boderPicker}>
      <Picker {...props} />
    </View>
    {description && !errorText ? (
      <Text style={styles.description}>{description}</Text>
    ) : null}
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 0,
  },
  boderPicker: {
    borderRadius: 10, borderWidth: 1,
    backgroundColor: theme.colors.surface,
    borderColor: "rgb(181,181,181)"
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
})

export default MyPicker
