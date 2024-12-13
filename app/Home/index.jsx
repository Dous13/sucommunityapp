import React, { useState } from 'react'; 
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([
    { id: '1', displayName: 'John Doe', college: 'B.S. Computer Science', followed: false },
    { id: '2', displayName: 'Jane Smith', college: 'B.A. English', followed: false },
  ]);
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = users.filter(user =>
      user.displayName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const toggleFollow = (userId) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, followed: !user.followed } : user
    );
    setUsers(updatedUsers);
  };

  const renderUser = ({ item }) => (
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
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.displayName}</Text>
            <TouchableOpacity
              style={[styles.followButton, item.followed ? styles.following : styles.notFollowing]}
              onPress={() => toggleFollow(item.id)}
            >
              <Text style={styles.followButtonText}>
                {item.followed ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.iconContainer}>
            <Text style={styles.college}>{item.college}</Text>
            <TouchableOpacity>
              <FontAwesome name="heart-o" size={24} color="#555" style={styles.iconSpacing} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="bookmark-outline" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <MaterialIcons name="search" size={24} color="#F95454" style={styles.searchIcon} />
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FF',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
  },
  cardContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 5,
  },
  iconSpacing: {
    marginLeft: 10,
  },
  followButton: {
    marginLeft: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  notFollowing: {
    backgroundColor: '#F95454',
  },
  following: {
    backgroundColor: '#5C6BC0',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
