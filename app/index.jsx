import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const randomDelay = Math.floor(Math.random() * 5000) + 1000; // Random delay between 1-5 seconds

    const timer = setTimeout(() => {
      router.push("/login"); // Navigate to the login page
    }, randomDelay);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F6FF",
      }}
    >
      <ActivityIndicator size="large" color="#F95454" />
    </View>
  );
}
