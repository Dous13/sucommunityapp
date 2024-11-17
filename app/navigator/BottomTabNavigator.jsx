import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Importing icons
import HomeScreen from '../Home/index';
import BooksScreen from '../Books/index';
import CafeteriaScreen from '../Cafeteria/index';
import NotificationsScreen from '../Notifications/index';
import MessagesScreen from '../Messages/index';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,  // Disable the header for the entire Tab Navigator
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
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Books" 
        component={BooksScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Cafeteria" 
        component={CafeteriaScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ headerShown: false }} 
      />
    </Tab.Navigator>
  );
}
