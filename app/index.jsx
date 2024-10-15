import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Link href={'/login'}>
        <Text>
          go to su app 
        </Text>
      </Link>
    </View>
  );
}
