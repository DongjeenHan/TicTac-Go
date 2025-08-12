import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { useApp } from "../context/AppContext";
import FixedBottomBar, {
  BOTTOM_BAR_HEIGHT,
} from "../components/FixedBottomBar";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;
type Mark = "X" | "O" | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function GameScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const { user, myMark, setMyMark } = useApp();

  const xCount = useMemo(() => board.filter((v) => v === "X").length, [board]);
  const oCount = useMemo(() => board.filter((v) => v === "O").length, [board]);
  const first = myMark;
  const turn: "X" | "O" = xCount === oCount ? first : first === "X" ? "O" : "X";

  const { winner, line } = useMemo(() => {
    for (const [a, b, c] of LINES) {
      const v = board[a];
      if (v && v === board[b] && v === board[c])
        return { winner: v, line: [a, b, c] as number[] };
    }
    return { winner: null as Mark, line: [] as number[] };
  }, [board]);

  const isTie = useMemo(
    () => board.every((v) => v) && !winner,
    [board, winner]
  );

  useEffect(() => {
    if (winner) navigation.navigate("Result", { winner });
    else if (isTie) navigation.navigate("Result", { isTie: true });
  }, [winner, isTie, navigation]);

  // honor { reset: true } when navigating back from other screens
  useEffect(() => {
    const gameRoute = navigation
      .getState()
      .routes.find((r) => r.name === "Game");
    const resetFlag = (gameRoute?.params as any)?.reset;
    if (resetFlag) {
      reset();
      navigation.setParams({ reset: undefined });
    }
  }, [navigation]);

  const press = (idx: number) => {
    if (board[idx] || winner) return;
    const next = [...board];
    next[idx] = turn;
    setBoard(next);
  };

  const reset = () => setBoard(Array(9).fill(null));

  const canChooseFirst = board.every((v) => v === null);
  const Seg = ({ mark }: { mark: "X" | "O" }) => {
    const active = first === mark;
    const color = mark === "X" ? "#ef4444" : "#3b82f6";
    return (
      <TouchableOpacity
        onPress={() => canChooseFirst && setMyMark(mark)}
        style={[
          Styles.segBtn,
          active ? Styles.segActive : Styles.segInactive,
          !canChooseFirst && Styles.segDisabled,
        ]}
        activeOpacity={0.8}
      >
        <Ionicons
          name={mark === "X" ? "close" : "ellipse-outline"}
          size={18}
          color={active ? "#fff" : color}
        />
      </TouchableOpacity>
    );
  };

  const renderCell = (idx: number) => {
    const value = board[idx];
    const inWin = line.includes(idx);
    const bg =
      winner === "X" && inWin
        ? "#fee2e2"
        : winner === "O" && inWin
        ? "#dbeafe"
        : "#ffffff";

    return (
      <TouchableOpacity
        key={idx}
        style={[Styles.cell, { backgroundColor: bg }]}
        onPress={() => press(idx)}
        activeOpacity={0.8}
      >
        {value === "X" && <Ionicons name="close" size={52} color="#ef4444" />}
        {value === "O" && (
          <Ionicons name="ellipse-outline" size={52} color="#3b82f6" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        Styles.wrap,
        { paddingBottom: BOTTOM_BAR_HEIGHT + insets.bottom },
      ]}
    >
      <Text style={Styles.title}>TicTac-GO!</Text>

      <View style={Styles.segment}>
        <Text style={Styles.label}>First turn</Text>
        <View style={Styles.segRow}>
          <Seg mark="X" />
          <Seg mark="O" />
        </View>
        {!canChooseFirst && (
          <Text style={Styles.hint}>Reset to change first turn</Text>
        )}
      </View>

      {!winner && !isTie && (
        <View style={Styles.turnRow}>
          <Text style={Styles.turnTxt}>Turn: </Text>
          <Ionicons
            name={turn === "X" ? "close" : "ellipse-outline"}
            size={22}
            color={turn === "X" ? "#ef4444" : "#3b82f6"}
          />
        </View>
      )}

      <View style={Styles.board}>
        {Array.from({ length: 9 }, (_, i) => renderCell(i))}
      </View>

      {/* Fixed bottom bar */}
      <FixedBottomBar onReset={reset} />
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
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 6,
  },
  segment: {
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 6,
  },
  segRow: {
    flexDirection: "row",
  },
  segBtn: {
    width: 80,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    borderWidth: 1,
  },
  segActive: {
    backgroundColor: "#1e293b",
    borderColor: "#1e293b",
  },
  segInactive: {
    backgroundColor: "#fff",
    borderColor: "#94a3b8",
  },
  segDisabled: { opacity: 0.5 },
  turnRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  turnTxt: {
    fontSize: 16,
    color: "#334155",
  },
  board: {
    width: 312,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: 100,
    height: 100,
    margin: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
