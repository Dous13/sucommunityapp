import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import for navigation
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig'; // Make sure this is your Firebase config file
import { useRouter } from 'expo-router';

export default function Books() {
  const navigation = useNavigation(); // Hook for navigation
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const router = useRouter();

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(db, 'books');
        const q = query(booksCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const booksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBooks(booksData);
        setFilteredBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);
    setFilteredBooks(
      books.filter((book) =>
        [book.title, book.author, book.genre, book.condition]
          .some((field) => field.toLowerCase().includes(text.toLowerCase()))
      )
    );
  };

  const handleFilterPress = () => {
    setIsModalVisible(true);
  };

  const applyFilters = () => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedAuthor) {
      filtered = filtered.filter((book) =>
        book.author.toLowerCase().includes(selectedAuthor.toLowerCase())
      );
    }
    if (selectedGenre) {
      filtered = filtered.filter((book) =>
        book.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }
    if (selectedCondition) {
      filtered = filtered.filter((book) =>
        book.condition.toLowerCase().includes(selectedCondition.toLowerCase())
      );
    }
    if (maxPrice) {
      filtered = filtered.filter((book) => parseFloat(book.price) <= parseFloat(maxPrice));
    }

    setFilteredBooks(filtered);
    setIsModalVisible(false);
  };

  const clearFilters = () => {
    setSelectedAuthor('');
    setSelectedGenre('');
    setSelectedCondition('');
    setMaxPrice('');
    setFilteredBooks(books);
    setSearchTerm('');
    setIsModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookDetails}>Author: {item.author}</Text>
      <Text style={styles.bookDetails}>Genre: {item.genre}</Text>
      <Text style={styles.bookDetails}>Condition: {item.condition}</Text>
      <Text style={styles.bookDetails}>Price: ${item.price}</Text>
      <Text style={styles.bookDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a book..."
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <Pressable onPress={handleFilterPress} style={styles.filterIcon}>
          <Ionicons name="filter" size={20} color="gray" />
        </Pressable>
      </View>

      {/* Add Button to Navigate to PostBook */}
      <View style={styles.buttonContainer}>
        <Button
          title="Post a Book"
          onPress={() => router.push('/Books/PostBooks')}
          color="#F95454"
        />
      </View>

      {filteredBooks.length === 0 ? (
        <Text style={styles.noBooksText}>No books found</Text>
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply Filters</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Author"
              value={selectedAuthor}
              onChangeText={setSelectedAuthor}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Genre"
              value={selectedGenre}
              onChangeText={setSelectedGenre}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Condition (New/Good/Acceptable)"
              value={selectedCondition}
              onChangeText={setSelectedCondition}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Max Price"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <Pressable style={styles.modalApplyButton} onPress={applyFilters}>
                <Text style={styles.modalButtonText}>Apply Filters</Text>
              </Pressable>
              <Pressable style={styles.modalCancelButton} onPress={clearFilters}>
                <Text style={styles.modalButtonText}>Clear Filters</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F6FF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterIcon: {
    marginHorizontal: 8,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  bookItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookDetails: {
    fontSize: 14,
    color: '#555',
  },
  bookDescription: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
  },
  noBooksText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginBottom: 12,
    padding: 8,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalApplyButton: {
    backgroundColor: '#F95454',
    padding: 16,
    borderRadius: 8,
  },
  modalCancelButton: {
    backgroundColor: '#8F8E8D',
    padding: 16,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
