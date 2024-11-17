import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig.js';

export default function MessagesScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const currentUser = 'yourUserId'; // Replace with the actual user ID from your authentication system

  // Fetch messages in real time
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        sentByUser: doc.data().senderId === currentUser, // Check if the message was sent by the current user
      }));
      setMessages(messagesData);
      setLoading(false); // Stop loading after messages are fetched
    });

    return unsubscribe;
  }, []);

  // Send a new message
  const handleSend = async () => {
    if (newMessage.trim()) {
      setLoading(true); // Optionally show a loading spinner when sending a message
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        timestamp: Date.now(),
        senderId: currentUser, // Store the current user's ID to identify the sender
      });
      setNewMessage('');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#CB3737" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.message, item.sentByUser && styles.sentMessage]}>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Message"
        />
        <Button 
          title="Send" 
          onPress={handleSend} 
          disabled={loading || !newMessage.trim()}
          color="#F95454"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6FF',
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
    maxWidth: '75%',
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start', // Align received messages to the left
  },
  sentMessage: {
    backgroundColor: '#F95454', // Sent messages have a different background
    alignSelf: 'flex-end', // Align sent messages to the right
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#aaa',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
  },
  input: {
    height: 45,
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    marginRight: 10,
  },
});