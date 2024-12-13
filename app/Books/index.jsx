import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FindBooks from './FindBooks'; // Ensure the path is correct based on file structure

const Books = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Books</Text>
      <FindBooks /> {/* This will show the search and list of books */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F6FF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Books;
