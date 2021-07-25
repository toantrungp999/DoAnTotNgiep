import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native';

const LoadingMore = props => (
  <View style={styles.container}>
    {props.show ? <ActivityIndicator size="small" color="#5495ff" /> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 25,
    paddingTop: 3,
  },
});

export default LoadingMore;
