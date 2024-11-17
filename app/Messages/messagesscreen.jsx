import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig.js';

export default function MessagesScreen() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the current user's ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setCurrentUserId(userId);
        } else {
          console.error('No user ID found. Ensure login logic is implemented.');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  // Fetch conversations
  useEffect(() => {
    if (!currentUserId) return; // Wait until the user ID is available

    const conversationsRef = collection(db, 'conversations');
    const q = query(conversationsRef, where('participants', 'array-contains', currentUserId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(convos);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUserId]);

  if (!currentUserId) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Conversations</Text>
      {loading ? (
        <Text>Loading conversations...</Text>
      ) : (
        <FlatList
          data={conversations}
          renderItem={({ item }) => (
            <View style={styles.conversation}>
              <Text>Chat with: {item.participants.filter((id) => id !== currentUserId).join(', ')}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  conversation: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});
