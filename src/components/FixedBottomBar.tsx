import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { useApp } from "../context/AppContext";

export const BOTTOM_BAR_HEIGHT = 64;

type Props = { onReset?: () => void };

export default function FixedBottomBar({ onReset }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const extra = Math.max(insets.bottom, 12);

  const handleReset = () => {
    if (onReset) return onReset();
    navigation.navigate("Game", { reset: true });
  };

  return (
    <SafeAreaView edges={["bottom"]} style={[Styles.wrap, { paddingBottom: extra, minHeight: BOTTOM_BAR_HEIGHT + extra }]}>
      <TouchableOpacity style={Styles.btn} onPress={handleReset} activeOpacity={0.8}>
        <Ionicons name="refresh-outline" size={20} color="#0f172a" />
        <Text style={Styles.lbl}>Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.btn} onPress={() => navigation.navigate(user ? "Stats" : "Login")} activeOpacity={0.8}>
        <Ionicons name={user ? "stats-chart-outline" : "log-in-outline"} size={20} color="#0f172a" />
        <Text style={Styles.lbl}>{user ? "Stats" : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.btn} onPress={() => navigation.navigate("About")} activeOpacity={0.8}>
        <Ionicons name="information-circle-outline" size={20} color="#0f172a" />
        <Text style={Styles.lbl}>About</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    zIndex: 10
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6
  },
  lbl: { fontSize: 14, color: "#0f172a", fontWeight: "600" }
});
