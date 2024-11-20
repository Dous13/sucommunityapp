import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const route = useRoute(); // Use useRoute hook to access params
  const [userData, setUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  const viewedUserId = route.params?.userId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('userId');
        setCurrentUserId(currentUser);

        const userIdToFetch = viewedUserId || currentUser;

        const userRef = doc(db, 'users', userIdToFetch);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
          if (viewedUserId && userDoc.data().followers?.includes(currentUser)) {
            setIsFollowing(true); // Check if current user is already following
          }
        } else {
          console.error('User not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [viewedUserId]);

  const handleFollow = async () => {
    if (currentUserId === viewedUserId) {
      console.error('Cannot follow yourself');
      return; // Prevent following self
    }
    try {
      const userRef = doc(db, 'users', viewedUserId);
      const currentUserRef = doc(db, 'users', currentUserId);
  
      // Fetch user data
      const userDoc = await getDoc(userRef);
      const currentUserDoc = await getDoc(currentUserRef);
  
      if (!userDoc.exists() || !currentUserDoc.exists()) {
        console.error('One of the users does not exist');
        return;
      }
  
      // Ensure fields exist as arrays
      const userFollowers = userDoc.data().followers || [];
      const currentUserFollowing = currentUserDoc.data().following || [];
  
      if (isFollowing) {
        // Unfollow logic
        await updateDoc(userRef, {
          followers: arrayRemove(currentUserId),
        });
        await updateDoc(currentUserRef, {
          following: arrayRemove(viewedUserId),
        });
        console.log('Unfollow successful');
        setIsFollowing(false);
      } else {
        // Follow logic
        await updateDoc(userRef, {
          followers: arrayUnion(currentUserId),
        });
        await updateDoc(currentUserRef, {
          following: arrayUnion(viewedUserId),
        });
        console.log('Follow successful');
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };         

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  const isCurrentUserProfile = currentUserId === viewedUserId;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: userData.profilePic || 'https://via.placeholder.com/150' }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{userData.displayname || 'No Name'}</Text>
      
      {/* Followers, Following, and Posts */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>{userData.posts || 0}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>{userData.followers?.length || 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statCount}>{userData.following?.length || 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Follow Button */}
      {!isCurrentUserProfile && (
        <TouchableOpacity
          style={[styles.followButton, isFollowing ? styles.unfollowButton : styles.followButton]}
          onPress={handleFollow}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 16,
    color: '#555',
  },
  followButton: {
    backgroundColor: '#F95454',
    padding: 10,
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
  },
  unfollowButton: {
    backgroundColor: '#ccc',
  },
  followButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#8F8e8d',
  },
});
