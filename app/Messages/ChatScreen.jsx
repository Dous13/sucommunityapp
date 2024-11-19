import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../config/FirebaseConfig.js';
import { collection, query, where, addDoc, onSnapshot, orderBy, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen() {
  const router = useRouter();
  const { conversationId } = useLocalSearchParams(); // Corrected: useLocalSearchParams for query params
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartnerName, setChatPartnerName] = useState('');

  // Fetch current user ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setCurrentUserId(userId);
      } else {
        console.error('No user ID found. Ensure login logic is implemented.');
      }
    };
    fetchUserId();
  }, []);

  // Fetch the displayname of the other user involved in the conversation
  useEffect(() => {
    if (!conversationId || !currentUserId) return;
  
    const fetchPartnerDisplayName = async () => {
      try {
        // Reference the correct field `participants`
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationSnap = await getDoc(conversationRef);
  
        if (conversationSnap.exists()) {
          const conversationData = conversationSnap.data();
  
          // Ensure participants is an array
          if (conversationData.participants && Array.isArray(conversationData.participants)) {
            const otherUserId = conversationData.participants.find((id) => id !== currentUserId);
  
            if (otherUserId) {
              // Fetch displayname of the other user
              const userRef = doc(db, 'users', otherUserId);
              const userSnap = await getDoc(userRef);
  
              if (userSnap.exists()) {
                setChatPartnerName(userSnap.data().displayname);
              } else {
                console.error('User not found');
              }
            } else {
              console.error('Other user ID not found in conversation');
            }
          } else {
            console.error('Participants field is not an array or is undefined');
          }
        } else {
          console.error('Conversation not found');
        }
      } catch (error) {
        console.error('Error fetching partner display name:', error);
      }
    };
  
    fetchPartnerDisplayName();
  }, [conversationId, currentUserId]);  

  // Real-time listener for messages in this conversation
  useEffect(() => {
    if (!conversationId) return;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Fetched messages:', snapshot.docs);
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return unsubscribe;
  }, [conversationId]);

  // Handle sending a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !conversationId) return;

    const messagesRef = collection(db, 'messages');
    const messageData = {
      text: newMessage,
      senderId: currentUserId,
      conversationId,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(messagesRef, messageData);
      setNewMessage('');
      console.log('Message sent:', messageData);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Render individual messages
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isCurrentUser ? 'white' : 'black' }, // White text for sent messages, black for received
          ]}
        >
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F95454" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chatPartnerName || 'Chat'}</Text>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F95454',
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    maxWidth: '75%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0078FF', // Messenger-like blue for sent messages
    borderTopRightRadius: 0, // Optional for aesthetic
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDEDED', // Light gray for received messages
    borderTopLeftRadius: 0, // Optional for aesthetic
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#F4F6FF',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#F95454',
    padding: 10,
    borderRadius: 50,
  },
});
