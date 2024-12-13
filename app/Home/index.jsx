import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Text, Modal, TouchableWithoutFeedback, ScrollView, Keyboard } from 'react-native';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { db } from '../../config/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export default function HomeScreen() {
  const [status, setStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBooks = () => {
      const booksCollection = collection(db, 'books');
      const unsubscribe = onSnapshot(booksCollection, (snapshot) => {
        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(booksData); // Store the books data
      });
      return unsubscribe; // Cleanup the listener
    };

    fetchBooks();
  }, []);

  const handlePost = () => {
    setIsModalVisible(false);
    console.log('Posted:', status);
    setStatus(''); // Clear status after posting
  };

  const handleCardClick = (book) => {
    setSelectedBook(book);
    setIsModalVisible(true);
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss(); // Optionally dismiss the keyboard when clicking outside
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.statusInput}
          placeholder="What's on your mind?"
          value={status}
          onChangeText={setStatus}
        />

        <Image 
          source={require('./../../assets/images/bookworm.jpg')}
          style={styles.image}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Home/PostBooks')}
        >
          <Icon name="plus-circle" size={45} color="red" />
        </TouchableOpacity>

        <View style={styles.booksListContainer}>
          {books.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={styles.card}
              onPress={() => handleCardClick(book)}
            >
              <Image
                source={{ uri: book.imageUrl || 'https://via.placeholder.com/300x150' }} 
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Image
                  source={{ uri: book.profileImage || 'https://via.placeholder.com/100x100' }}
                  style={styles.profileImage}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{book.title}</Text>
                  <Text style={styles.college}>{book.author}</Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity>
                    <MaterialIcons name="bookmark-outline" size={24} color="#555" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <FontAwesome name="heart-o" size={24} color="#555" style={styles.iconSpacing} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Modal for book details */}
        {selectedBook && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>{selectedBook.title}</Text>
                  <Text style={styles.modalAuthor}>{selectedBook.author}</Text>
                  <Image
                    source={{ uri: selectedBook.imageUrl || 'https://via.placeholder.com/300x150' }}
                    style={styles.modalImage}
                  />
                  <Text style={styles.modalDescription}>{selectedBook.description}</Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F4F6FF',
    paddingBottom: 20,
  },
  statusInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    width: '60%',
    position: 'absolute',
    top: 20, 
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    top: 15,
    left: 15,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -9,
    right: -5, 
    padding: 20,
  },
  booksListContainer: {
    marginTop: 80,
    width: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  college: {
    fontSize: 14,
    color: '#777',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalAuthor: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#555',
  },
  closeButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
