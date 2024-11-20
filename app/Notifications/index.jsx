import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Notifications() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);

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

  useEffect(() => {
    if (!currentUserId) return;

    const fetchNotifications = async () => {
      try {
        const conversationsRef = collection(db, 'conversations');
        const q = query(
          conversationsRef,
          where('participants', 'array-contains', currentUserId)
        );

        const conversationsSnapshot = await getDocs(q);
        console.log(
          'Conversations snapshot:',
          conversationsSnapshot.docs.map((doc) => doc.data())
        );

        const notificationsData = [];

        for (const convoDoc of conversationsSnapshot.docs) {
          const convoData = convoDoc.data();
          console.log('Processing conversation:', convoData);

          const otherParticipantId = convoData.participants.find(
            (id) => id !== currentUserId
          );

          if (!otherParticipantId) continue;

          const messagesRef = collection(db, 'messages');
          const messagesQuery = query(
            messagesRef,
            where('conversationId', '==', convoDoc.id),
            orderBy('timestamp', 'desc'),
            limit(1)
          );

          const messageSnapshot = await getDocs(messagesQuery);

          if (messageSnapshot.empty) continue;

          const latestMessage = messageSnapshot.docs[0].data();
          console.log('Latest message:', latestMessage);

          const userRef = doc(db, 'users', otherParticipantId);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) continue;

          const displayName = userDoc.data().displayname || 'Unknown';

          notificationsData.push({
            id: convoDoc.id,
            senderName: displayName,
            message: `${displayName} has sent you a message`,
            timestamp: latestMessage.timestamp?.toDate(),
          });
        }

        notificationsData.sort((a, b) => b.timestamp - a.timestamp);
        console.log('Final notifications:', notificationsData);

        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [currentUserId]);

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.body}>{item.message}</Text>
        <Text style={styles.timestamp}>{item.timestamp.toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.emptyText}>No notifications yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#F4F6FF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F95454',
    marginLeft: 20,
    marginBottom: 10,
  },
  notificationItem: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  body: {
    fontSize: 14,
    color: '#555',
  },
  timestamp: {
    fontSize: 12,
    color: '#8F8E8D',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8F8E8D',
    marginTop: 50,
  },
});
