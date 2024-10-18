import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notifications Screen Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FF',
  },
  text: {
    fontSize: 24,
    color: '#8F8e8d',
  },
});