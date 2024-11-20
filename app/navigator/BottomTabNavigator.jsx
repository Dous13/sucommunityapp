import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Importing icons
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'; // For custom header elements
import HomeScreen from '../Home/index';
import BooksScreen from '../Books/index';
import CafeteriaScreen from '../Cafeteria/index';
import NotificationsScreen from '../Notifications/index';
import MessagesScreen from '../Messages/index';
import { useRouter } from 'expo-router';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear user session if applicable (e.g., remove tokens)
    // navigate to login screen
    navigation.replace('login/signin'); // Use replace to prevent going back
  };
  

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,  // Show header
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Books':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Cafeteria':
              iconName = focused ? 'fast-food' : 'fast-food-outline';
              break;
            case 'Notifications':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'Messages':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F95454', // Primary color
        tabBarInactiveTintColor: '#8F8e8d', // Gray color
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>SU Community</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push('../Profile/ProfileScreen')}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D' }}  // Replace with your profile image URL
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                  <Ionicons name="log-out" size={24} color="#333" style={styles.logoutIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#F4F6FF', // Light background color for header
            height: 80, // Adjust header height
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
          },
        }}
      />
      <Tab.Screen 
        name="Books" 
        component={BooksScreen} 
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>SU Community</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push('/Profile')}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D' }}  // Replace with your profile image URL
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                  <Ionicons name="log-out" size={24} color="#333" style={styles.logoutIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#F4F6FF',
            height: 80,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
          },
        }}
      />
      <Tab.Screen 
        name="Cafeteria" 
        component={CafeteriaScreen} 
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>SU Community</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push('/Profile')}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D' }}  // Replace with your profile image URL
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                  <Ionicons name="log-out" size={24} color="#333" style={styles.logoutIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#F4F6FF',
            height: 80,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
          },
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>SU Community</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push('/Profile')}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D' }}  // Replace with your profile image URL
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                  <Ionicons name="log-out" size={24} color="#333" style={styles.logoutIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ),
            headerStyle: {
            backgroundColor: '#F4F6FF',
            height: 80,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
          },
        }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>SU Community</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push('/Profile')}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D' }}  // Replace with your profile image URL
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                  <Ionicons name="log-out" size={24} color="#333" style={styles.logoutIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#F4F6FF',
            height: 80,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F95454',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  logoutIcon: {
    marginLeft: 10,
  },
});
