import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../config/FirebaseConfig'; //Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firestore query methods
import { useRouter } from 'expo-router'; // Import the router from expo-router
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter(); // Hook to handle navigation

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true); // Start loading
    setError(null);   // Clear any previous error

    try {
      const q = query(collection(db, "users"), where("Email", "==", email)); // Query by email
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("User not found.");
        setLoading(false); // Stop loading
        return;
      }

      querySnapshot.forEach(async (doc) => {
        const userData = doc.data();

        if (userData.Password === password) {
          console.log("Sign-in successful!");

          // Save the user ID in AsyncStorage
          await AsyncStorage.setItem('userId', doc.id);
          console.log('User ID saved:', doc.id);

          setLoading(false); // Stop loading
          router.push('../../navigator/BottomTabNavigator'); // Navigate to BottomTabNavigator
        } else {
          setError("Incorrect password.");
          setLoading(false); // Stop loading
        }
      });
    } catch (error) {
      setError("Error during sign-in. Please try again.");
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#F95454" /> // Show loading spinner
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FF',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F95454',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#8F8e8d',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    backgroundColor: '#F95454',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
