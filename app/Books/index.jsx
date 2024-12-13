import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample books data
const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    condition: "New",
    price: "$10.99",
    description: "A novel about the American dream.",
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    condition: "Good",
    price: "$8.99",
    description: "A dystopian novel about surveillance.",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    condition: "Acceptable",
    price: "$5.99",
    description: "A novel about racial injustice.",
  },
];

export default function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [filteredBooks, setFilteredBooks] = useState(books);

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
      filtered = filtered.filter((book) => parseFloat(book.price.slice(1)) <= parseFloat(maxPrice));
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

      {filteredBooks.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>No books found</Text>
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
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
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18, // Clearer and larger font
    fontWeight: '500', // Medium font weight
    padding: 4,
    color: '#000000', // Black color for better contrast
  },
  filterIcon: {
    marginHorizontal: 8,
  },
  bookItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
    padding: 10,
    borderRadius: 5,
  },
  modalCancelButton: {
    backgroundColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
