import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

export default function HomeScreen() {
  const [status, setStatus] = React.useState('');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* "What's on your mind?" input */}
      <TextInput
        style={styles.statusInput}
        placeholder="What's on your mind?"
        value={status}
        onChangeText={setStatus}
      />
  
    <Image 
        source={require('./../../assets/images/bookworm.jpg')}  // Correct the path to your image
        style={styles.image}
      />

      {/* Plus button with icon */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Home/PostBooks')}  // Navigate to PostBooks
      >
        <Icon name="plus-circle" size={45} color="red" /> {/* Icon instead of text */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FF',
    padding: 25,
  },
  statusInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    width: '70%',  // Adjust width of input box
    position: 'absolute',
    top: 20, 
  },

    image: {
    width: 60,
    height: 60,
    borderRadius: 30,  // Make it a circle
    position: 'absolute',
    top: 15,
    left: 15,
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    right: 12, 
  },
});
