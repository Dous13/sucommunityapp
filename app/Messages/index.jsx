import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,FlatList,StyleSheet,TouchableOpacity,ActivityIndicator,} from 'react-native';
import { useRouter } from "expo-router"; // Import useRouter for navigation
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from '../../config/FirebaseConfig.js';
import { collection, query, where, addDoc, onSnapshot, getDoc, doc } from 'firebase/firestore';

export default function MessagesScreen() {
  const router = useRouter(); 
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        setCurrentUserId(userId);
      } else {
        console.error("No user ID found. Ensure login logic is implemented.");
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const conversationsRef = collection(db, 'conversations');
    const q = query(conversationsRef, where('participants', 'array-contains', currentUserId));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const convos = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const convoData = doc.data();
          const participants = convoData.participants.filter(id => id !== currentUserId);

          const fetchNames = participants.map(async (id) => {
            const userDoc = await getDoc(doc(db, 'users', id));
            return userDoc.exists() ? userDoc.data().displayname : 'Unknown';
          });

          const displayNames = await Promise.all(fetchNames);

          return {
            id: doc.id,
            participants,
            displayNames,
            createdAt: convoData.createdAt,
          };
        })
      );
      setConversations(convos);
    });

    return unsubscribe;
  }, [currentUserId]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('Email', '==', searchQuery));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const users = await Promise.all(snapshot.docs.map(async (doc) => {
        const userData = doc.data();
        return {
          id: doc.id,
          email: userData.Email,
          displayname: userData.displayname || 'No name available',
        };
      }));
      setSearchResults(users);
      setLoading(false);
    });

    return () => unsubscribe();
  };

  const handleStartConversation = async (user) => {
    if (!currentUserId) return;

    setLoading(true);

    const conversationsRef = collection(db, 'conversations');
    const existingConversation = conversations.find(
      (c) => c.participants.includes(user.id)
    );

    let conversationId;
    if (existingConversation) {
      conversationId = existingConversation.id;
    } else {
      const newConversation = {
        participants: [currentUserId, user.id],
        createdAt: new Date(),
      };
      const docRef = await addDoc(conversationsRef, newConversation);
      conversationId = docRef.id;
    }

    setLoading(false);
    setSearchQuery('');
    setSearchResults([]);

    router.push(`/chat/${conversationId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search user by email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F95454" />
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.searchResultItem}
              onPress={() => handleStartConversation(item)}
            >
              <Text style={styles.userEmail}>{item.displayname}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : null}

      <Text style={styles.sectionHeader}>Conversations</Text>
      <FlatList
        data={conversations}
        renderItem={({ item }) => {
          const otherParticipants = item.displayNames.join(', ');
          return (
            <TouchableOpacity
              style={styles.conversationItem}
              onPress={() => router.push(`/chat/${item.id}`)}
            >
              <Text style={styles.conversationText}>
                Chat with: {otherParticipants}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6FF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#F95454',
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchResultItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  userEmail: {
    color: '#333',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#F95454',
  },
  conversationItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  conversationText: {
    color: '#333',
  },
});
