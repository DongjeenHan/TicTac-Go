import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import FixedBottomBar, {
  BOTTOM_BAR_HEIGHT,
} from "../components/FixedBottomBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "About">;

export default function AboutScreen(_props: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        Styles.wrap,
        { paddingBottom: BOTTOM_BAR_HEIGHT + insets.bottom },
      ]}
    >
      <Text style={Styles.title}>About TicTac-GO!</Text>
      <Text style={Styles.text}>
        A modern Tic Tac Toe game developed by Team TriUnity.
      </Text>
      <Text style={Styles.sub}>Team Members</Text>
      <Text style={Styles.text}>Madara, Mark — [000894819]</Text>
      <Text style={Styles.text}>Han, Dongjeen — [000938391]</Text>
      <Text style={Styles.text}>Harika, Gurman — [000946804]</Text>
      <Text style={Styles.date}>July 2025</Text>

      <FixedBottomBar />
    </View>
  );
}

const Styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 8,
  },
  sub: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: "#334155",
    textAlign: "center",
  },
  date: {
    marginTop: 16,
    fontStyle: "italic",
    color: "#64748b",
  },
});
