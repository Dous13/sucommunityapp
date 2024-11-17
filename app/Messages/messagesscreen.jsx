import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../config/FirebaseConfig.js';
import { collection, doc, getDoc, onSnapshot, addDoc } from 'firebase/firestore';

export default function ChatScreen() {
  const router = useRouter();
  const { conversationId } = router.query;  // Get the conversation ID from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const loadedMessages = snapshot.docs.map(doc => doc.data());
        setMessages(loadedMessages);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    await addDoc(messagesRef, {
      text: newMessage,
      senderId: 'currentUserId',  // Replace with actual current user ID
      timestamp: new Date(),
    });

    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text>{item.senderId}: {item.text}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={loading ? <ActivityIndicator size="large" color="#F95454" /> : null}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={newMessage}
        onChangeText={setNewMessage}
      />
      
      <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6FF',
  },
  messageItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  sendButton: {
    backgroundColor: '#F95454',
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
