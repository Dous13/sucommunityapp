import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { db } from '../../config/FirebaseConfig'; // Adjust this path based on your folder structure
import { collection, onSnapshot } from 'firebase/firestore';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationsRef = collection(db, 'notifications'); // Firestore collection
    const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
      const notifData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched Notifications:", notifData); // Debugging
      setNotifications(notifData);
    });

    return () => unsubscribe();
  }, []);

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Image
        style={styles.avatar}
        source={{
          uri: item.profilePic || 'https://via.placeholder.com/40', // Placeholder profile picture
        }}
      />
      <View style={styles.notificationContent}>
        <Text style={styles.body}>
          <Text style={styles.username}>{item.username || "Someone"} </Text>
          {item.body}
        </Text>
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
    marginBottom: 0,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontWeight: 'bold',
    color: '#333',
  },
  body: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8F8e8d',
    marginTop: 50,
  },
});
