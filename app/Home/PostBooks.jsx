import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function PostBooks() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation(); // Get the navigation object


  React.useLayoutEffect(() => {
    // Set header title to an empty string
    navigation.setOptions({
      title: '', // Removes "Home/PostBooks" but keeps the back arrow
    });
  }, [navigation]);


  
  const handleSubmit = () => {
    // Handle the submission of the book details
    console.log({
      title,
      author,
      genre,
      condition,
      price,
      description,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Post a Book</Text>

        <Text style={styles.label}>Book Title:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the title of the book"
          value={title}
          onChangeText={setTitle}
        />
        
        <Text style={styles.label}>Author Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the author's name"
          value={author}
          onChangeText={setAuthor}
        />
        
        <Text style={styles.label}>Genre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the genre of the book"
          value={genre}
          onChangeText={setGenre}
        />
        
        <Text style={styles.label}>Condition:</Text>
        <TextInput
          style={styles.input}
          placeholder="New/Good/Acceptable"
          value={condition}
          onChangeText={setCondition}
        />
        
        <Text style={styles.label}>Price (if applicable):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        
        <Text style={styles.label}>Description (optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a brief description"
          value={description}
          onChangeText={setDescription}
        />

        {/* Submit button only */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Post Book</Text>
          </Pressable>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    alignSelf: 'flex-start',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  submitButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
