import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from 'expo-router';

export default function Books() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Books/PostBooks')}
        >
          <Text style={styles.buttonText}>Post a Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Books/FindBooks')}
        >
          <Text style={styles.buttonText}>Find a Book</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.placeholderContainer}>
        <Text style={styles.text}>Books Screen Placeholder</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F6FF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 20, // Add spacing from the top
  },
  button: {
    flex: 1,
    backgroundColor: '#F95454',
    paddingVertical: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'coolvetica', // Custom font
  },
  placeholderContainer: {
    flex: 1, // Push the text to the center of the remaining space
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#8F8e8d',
  },
});
