import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useApp } from "../context/AppContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FixedBottomBar, {
  BOTTOM_BAR_HEIGHT,
} from "../components/FixedBottomBar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Stats">;

export default function StatsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user, stats, resetStats, logout } = useApp();

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Game" }] });
  };

  return (
    <View
      style={[
        Styles.wrap,
        { paddingBottom: BOTTOM_BAR_HEIGHT + insets.bottom },
      ]}
    >
      <Text style={Styles.title}>Your Stats</Text>
      <Text style={Styles.email}>{user ?? "Guest"}</Text>

      <View style={Styles.card}>
        <Text style={Styles.cardTitle}>As X</Text>
        <View style={Styles.rowBetween}>
          <Text style={Styles.item}>Wins: {stats.X.wins}</Text>
          <Text style={Styles.item}>Losses: {stats.X.losses}</Text>
          <Text style={Styles.item}>Ties: {stats.X.ties}</Text>
        </View>
      </View>

      <View style={Styles.card}>
        <Text style={Styles.cardTitle}>As O</Text>
        <View style={Styles.rowBetween}>
          <Text style={Styles.item}>Wins: {stats.O.wins}</Text>
          <Text style={Styles.item}>Losses: {stats.O.losses}</Text>
          <Text style={Styles.item}>Ties: {stats.O.ties}</Text>
        </View>
      </View>

      <View style={Styles.row}>
        <Button title="Reset All" onPress={resetStats} />
        <View style={{ width: 12 }} />
        <Button title="Play" onPress={() => navigation.navigate("Game")} />
        {user && (
          <>
            <View style={{ width: 12 }} />
            <Button title="Logout" onPress={handleLogout} />
          </>
        )}
      </View>

      <FixedBottomBar />
    </View>
  );
}

const Styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 6,
  },
  email: {
    color: "#334155",
    marginBottom: 12,
  },
  card: {
    width: "86%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    fontSize: 16,
    color: "#0f172a",
  },
  row: {
    flexDirection: "row",
    marginTop: 12,
  },
});
