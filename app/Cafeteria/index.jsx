import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function CafeteriaScreen() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const cafeteriaCollection = collection(db, 'cafeteria');
        const querySnapshot = await getDocs(cafeteriaCollection);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching cafeteria menu:', error);
      }
    };

    fetchMenu();
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.menuItem, item.status === 'out of stock' ? styles.outOfStock : null]}>
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <Text style={styles.itemStatus}>{item.status === 'unavailable' ? 'Unavailable' : 'Available'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cafeteria Menu</Text>
      {menuItems.length > 0 ? (
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.placeholderText}>Loading menu...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6FF',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F95454',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  outOfStock: {
    opacity: 0.5,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#8F8e8d',
  },
  itemStatus: {
    fontSize: 14,
    color: '#F95454',
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#8F8e8d',
    marginTop: 20,
  },
});
