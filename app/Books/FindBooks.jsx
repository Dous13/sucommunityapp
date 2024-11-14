import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FindBooks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Example dummy data for books
  const books = [
    { title: 'Book 1', author: 'Author 1', genre: 'Genre 1', condition: 'New', price: '$10', description: 'Description 1' },
    { title: 'Book 2', author: 'Author 2', genre: 'Genre 2', condition: 'Good', price: '$15', description: 'Description 2' },
  ];

  const [filteredBooks, setFilteredBooks] = useState(books);

  const handleSearch = (text) => {
    setSearchTerm(text);
    setFilteredBooks(
      books.filter((book) =>
        book.title.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const handleFilterPress = () => {
    setIsModalVisible(true); // Open the filter modal
  };

  // Apply filters based on user input
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
      filtered = filtered.filter((book) => parseFloat(book.price.slice(1)) <= parseFloat(maxPrice));
    }

    setFilteredBooks(filtered);
    setIsModalVisible(false); // Close the modal after applying filters
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text>Author: {item.author}</Text>
      <Text>Genre: {item.genre}</Text>
      <Text>Condition: {item.condition}</Text>
      <Text>Price: {item.price}</Text>
      <Text>Description: {item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
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

      <FlatList
        data={filteredBooks}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
      />

      {/* Filter Modal */}
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
              <Pressable style={styles.modalCancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  filterIcon: {
    marginLeft: 8,
  },
  bookItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalApplyButton: {
    padding: 10,
    backgroundColor: '#F95454',
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  modalCancelButton: {
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
