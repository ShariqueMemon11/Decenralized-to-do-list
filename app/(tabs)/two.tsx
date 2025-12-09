import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TabTwoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tab Two</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TabTwoScreen;