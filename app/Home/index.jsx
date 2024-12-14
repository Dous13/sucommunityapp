import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { db } from '../../config/FirebaseConfig';  // Import Firestore config
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth'; // Import Firebase authentication

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch books from Firestore
  useEffect(() => {
    const fetchBooks = async () => {
      const booksSnapshot = await getDocs(collection(db, 'books'));
      const booksData = booksSnapshot.docs.map((doc) => doc.data());
      setBooks(booksData);
    };

    fetchBooks();
  }, []);

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;  // Get current user ID

      if (userId) {
        const userSnapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
        const userData = userSnapshot.docs.map(doc => doc.data())[0];  // Get first match

        if (userData) {
          setUser(userData);  // Set the user data in state
        }
      }
    };

    fetchUser();
  }, []);

  const handleSearch = () => {
    // Handle search query here (you can filter or navigate to profile)
    console.log('Search Query:', searchQuery);
  };

  const handlePostStatus = () => {
    // Post status to Firestore or manage it in local state for now
    console.log('Post Status:', status);
    setStatus(''); // Clear the input after posting
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search"
        onSubmitEditing={handleSearch} // Trigger search on enter
      />

      {/* Check if user data is available before rendering */}
      {user ? (
        <TouchableOpacity onPress={() => router.push('/Profile/ProfileScreen')}>
          <View style={styles.card}>
            <Image source={{ uri: 'https://via.placeholder.com/300x150' }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              {/* Display user profile image */}
              <Image source={{ uri: user.profilePic || 'https://via.placeholder.com/100x100' }} style={styles.profileImage} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.college}>{user.college || 'No College Info'}</Text>
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
          </View>
        </TouchableOpacity>
      ) : (
        <Text>Loading user data...</Text>
      )}

      <TextInput
        style={styles.statusInput}
        value={status}
        onChangeText={setStatus}
        placeholder="What's on your mind?"
      />
      <Button title="Post Status" onPress={handlePostStatus} />

      <FlatList
        data={books}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookCard}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>By: {item.author}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FF',
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
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
    marginBottom: 20,
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
  statusInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  bookCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  bookTitle: {
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#777',
  },
});
