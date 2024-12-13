import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://via.placeholder.com/300x150' }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100x100' }} 
            style={styles.profileImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.college}>B.Sc. Computer Science</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity>
              <MaterialIcons name="bookmark-outline" size={24} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="heart-o" size={24} color="#555" style={styles.iconSpacing} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  college: {
    fontSize: 14,
    color: '#777',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 10,
  },
});