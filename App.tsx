import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameScreen from "./src/screens/GameScreen";
import ResultScreen from "./src/screens/ResultScreen";
import LoginScreen from "./src/screens/LoginScreen";
import AboutScreen from "./src/screens/AboutScreen";
import type { RootStackParamList } from "./src/types/navigation";
import StatsScreen from "./src/screens/StatsScreen";
import { AppProvider } from "./src/context/AppContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Game"
          screenOptions={{
            headerStyle: { backgroundColor: "#4405d7ff" },
            headerTintColor: "#fff",
            headerBackVisible: false,
          }}
        >
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{
              title: "TicTac-GO!",
              headerTitleAlign: "center",
              headerBackVisible: false, // disable back button for this screen
            }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{
              title: "Result",
              headerBackVisible: false, // also disable for this screen if needed
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login" }}
          />
          <Stack.Screen
            name="Stats"
            component={StatsScreen}
            options={{ title: "Your Stats" }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ title: "About" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
