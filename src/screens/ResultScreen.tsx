import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import FixedBottomBar, {
  BOTTOM_BAR_HEIGHT,
} from "../components/FixedBottomBar";
import { useApp } from "../context/AppContext";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export default function ResultScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { winner, isTie } = route.params ?? {};
  const theme =
    winner === "X" ? "#ef4444" : winner === "O" ? "#3b82f6" : "#334155";
  const headline = winner ? `Player ${winner} wins!` : "It's a tie!";
  const { myMark, record } = useApp();
  const didRecord = useRef(false);

  const scale = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 140,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 850,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 850,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [scale, pulse]);

  useEffect(() => {
    if (didRecord.current) return;
    const { winner, isTie } = route.params ?? {};
    if (isTie) record("tie");
    else if (winner) record(winner === myMark ? "win" : "loss");
    didRecord.current = true;
  }, [record, myMark, route.params]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <View
      style={[
        Styles.wrap,
        { paddingBottom: BOTTOM_BAR_HEIGHT + insets.bottom },
      ]}
    >
      <Animated.View
        style={[
          Styles.banner,
          {
            backgroundColor: theme + "22",
            borderColor: theme,
            transform: [{ scale }, { scale: pulseScale }],
            shadowColor: theme,
            shadowOpacity: Platform.OS === "ios" ? 0.35 : 0,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: Platform.OS === "android" ? 8 : 0,
          },
        ]}
      >
        {winner ? (
          <Ionicons
            name={winner === "X" ? "close" : "ellipse-outline"}
            size={64}
            color={theme}
            style={{ marginBottom: 8 }}
          />
        ) : (
          <Ionicons
            name="hand-left-outline"
            size={64}
            color={theme}
            style={{ marginBottom: 8 }}
          />
        )}

        <Text style={[Styles.title, { color: theme }]}>{headline}</Text>
        <Text style={Styles.sub}>
          {winner ? `${winner} takes the round.` : "Evenly matched!"}
        </Text>
      </Animated.View>

      <View style={Styles.row}>
        <Button
          title="Play Again"
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: "Game" }] })
          }
        />
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
  banner: {
    width: "88%",
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "center",
  },
  sub: {
    fontSize: 16,
    color: "#334155",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
  },
});
