import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import BottomTabNavigator from './navigator/BottomTabNavigator';

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  useFonts({
    'coolvetica': require('./../assets/fonts/coolvetica.otf'),
  });

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <Stack>
        <Stack.Screen 
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login/signin"
          options={{
            headerShown: false,
          }}
        />
        {/* Add PostBooks Screen */}
        <Stack.Screen
          name="Books/PostBooks"
          options={{
            title: 'Post a Book', // Customize the header title
          }}
        />
        <Stack.Screen
          name="navigator/BottomTabNavigator"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Messages/ChatScreen"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ClerkProvider>
  );
}