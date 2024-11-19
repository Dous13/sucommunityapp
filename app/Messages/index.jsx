import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icons library
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../config/FirebaseConfig.js';
import { collection, query, where, addDoc, onSnapshot, getDoc, doc, getDocs, orderBy, limit } from 'firebase/firestore';

export default function MessagesScreen() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch current user ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          console.log('Current User ID:', userId); // Debugging
          setCurrentUserId(userId);
        } else {
          console.error('No user ID found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserId();
  }, []);

  // Fetch conversations whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (!currentUserId) {
        console.log('No currentUserId found, skipping conversations fetch.');
        return;
      }

      console.log('Fetching conversations for userId:', currentUserId);
      const conversationsRef = collection(db, 'conversations');
      const q = query(conversationsRef, where('participants', 'array-contains', currentUserId));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        if (snapshot.empty) {
          console.log('No conversations found for currentUserId:', currentUserId);
          setConversations([]);
          return;
        }

        const convos = await Promise.all(
          snapshot.docs.map(async (document) => {
            const convoData = document.data();
            const participants = convoData.participants.filter((id) => id !== currentUserId);

            // Fetch names of participants
            const fetchNames = participants.map(async (participantId) => {
              try {
                const userRef = doc(db, 'users', participantId);
                const userDoc = await getDoc(userRef);
                return userDoc.exists() ? userDoc.data().displayname : 'Unknown';
              } catch (error) {
                console.error(`Error fetching user data for ${participantId}:`, error);
                return 'Unknown';
              }
            });

            const displayNames = await Promise.all(fetchNames);

            // Fetch the latest message in the conversation
            const messagesRef = collection(db, 'messages');
            const messagesQuery = query(
              messagesRef,
              where('conversationId', '==', document.id),
              orderBy('timestamp', 'desc'),
              limit(1)
            );

            let lastMessage = 'No messages yet';
            let timestamp = new Date(0);

            try {
              const latestMessageSnapshot = await getDocs(messagesQuery);
              if (!latestMessageSnapshot.empty) {
                const latestMessageDoc = latestMessageSnapshot.docs[0].data();
                lastMessage = latestMessageDoc.text;
                timestamp = latestMessageDoc.timestamp?.toDate() || new Date(0);
              }
            } catch (error) {
              console.error('Error fetching latest message:', error);
            }

            return {
              id: document.id,
              participants,
              displayNames,
              lastMessage,
              timestamp,
            };
          })
        );

        // Sort conversations by timestamp (most recent first)
        convos.sort((a, b) => b.timestamp - a.timestamp);
        setConversations(convos);
      });

      return () => unsubscribe();
    }, [currentUserId])
  );

  // Search for users based on email
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    const usersRef = collection(db, 'users');

    const q = query(
      usersRef,
      where('Email', '>=', searchQuery),
      where('Email', '<=', searchQuery + '\uf8ff')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const users = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const userData = doc.data();
          return {
            id: doc.id,
            email: userData.Email,
            displayname: userData.displayname || 'No name available',
            timestamp: new Date(), // Provide a default date if needed
          };
        })
      );
      setSearchResults(users);
      setLoading(false);
    });

    return () => unsubscribe();
  };

  // Start or find an existing conversation
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

    // Navigate to the chat screen with the conversation ID
    if (conversationId) {
      router.push(`/Messages/ChatScreen?conversationId=${conversationId}`);
    } else {
      console.error('Failed to create or find the conversation.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#8F8E8D" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a user..."
          placeholderTextColor="#8F8E8D"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Results or Loading */}
      {loading ? (
        <ActivityIndicator size="large" color="#F95454" />
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => handleStartConversation(item)}
            >
              <Ionicons name="person-circle-outline" size={40} color="#F95454" />
              <Text style={styles.resultText}>{item.displayname}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : null}

      {/* Conversations */}
      <Text style={styles.sectionHeader}>Your Conversations</Text>
      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationCard}
            onPress={() => router.push(`/Messages/ChatScreen?conversationId=${item.id}`)}
          >
            <Image
              source={{
                uri: 'https://via.placeholder.com/40',
              }}
              style={styles.profileImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.conversationText}>{item.displayNames.join(', ')}</Text>
              <Text style={styles.lastMessageText}>{item.lastMessage}</Text>
            </View>
            <Text style={styles.timestamp}>
              {item.timestamp
                ? item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'No timestamp'}
            </Text>
          </TouchableOpacity>
        )}
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
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  searchButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F95454',
    borderRadius: 30,
  },
  searchButtonText: {
    color: '#fff',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  resultText: {
    marginLeft: 10,
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  conversationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessageText: {
    fontSize: 14,
    color: '#8F8E8D',
  },
  timestamp: {
    fontSize: 12,
    color: '#8F8E8D',
  },
});
