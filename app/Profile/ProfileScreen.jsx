import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigationOptions } from 'expo-router';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);

  useNavigationOptions({
    headerShown: false, // This hides the header
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.error('No user ID found');
          return;
        }

        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error('User not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: userData.profilePic || 'https://via.placeholder.com/150' }} 
        style={styles.profileImage} 
      />
      <Text style={styles.name}>{userData.displayname || 'No Name'}</Text>
      <Text style={styles.info}>Email: {userData.email || 'No Email'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F4F6FF',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F95454',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  loadingText: {
    fontSize: 18,
    color: '#8F8e8d',
  },
});
