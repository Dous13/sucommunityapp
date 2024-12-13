import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Keyboard, ScrollView, TouchableWithoutFeedback, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import { app } from '../../config/FirebaseConfig.js'; // Import your Firebase config
const db = getFirestore(app); // Initialize Firestore

export default function PostBooks() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const removeImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
    });
  }, [navigation]);

  const handleSubmit = async () => {
    try {
      const bookData = {
        title,
        author,
        genre,
        condition,
        price,
        description,
        images: selectedImages,
        createdAt: new Date(),
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, "books"), bookData);
      console.log("Book posted with ID: ", docRef.id);

      // Reset form after submission
      setTitle('');
      setAuthor('');
      setGenre('');
      setCondition('');
      setPrice('');
      setDescription('');
      setSelectedImages([]);

      // Alert user and go back to the previous screen
      alert("Book posted successfully!");
      navigation.goBack();
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error posting book. Please try again.");
    }
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

        {/* Camera Icon Button for Image Picker */}
        <View style={styles.imagePickerContainer}>
          <Pressable style={styles.imagePickerButton} onPress={pickImage}>
            <FontAwesome name="camera" size={24} color="white" />
          </Pressable>
          <Text style={styles.imagePickerText}>Add Images</Text>
        </View>

        {/* Display Selected Images */}
        <View style={styles.imageContainer}>
          {selectedImages.map((imageUri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: imageUri }} style={styles.selectedImage} />
              <Pressable style={styles.removeButton} onPress={() => removeImage(index)}>
                <Text style={styles.removeButtonText}>X</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Submit button */}
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
  imagePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePickerButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    marginRight: 10,
  },
  imagePickerText: {
    fontSize: 16,
    color: 'gray',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageWrapper: {
    position: 'relative',
    margin: 5,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'black',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
