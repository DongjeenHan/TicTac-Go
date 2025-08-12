import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;
type Mark = 'X' | 'O' | null;

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export default function GameScreen({ navigation }: Props) {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const { user, myMark, setMyMark } = useApp();

  const xCount = useMemo(() => board.filter(v => v === 'X').length, [board]);
  const oCount = useMemo(() => board.filter(v => v === 'O').length, [board]);
  const first = myMark;
  const turn: 'X' | 'O' = xCount === oCount ? first : first === 'X' ? 'O' : 'X';

  const { winner, line } = useMemo(() => {
    for (const [a, b, c] of LINES) {
      const v = board[a];
      if (v && v === board[b] && v === board[c]) return { winner: v, line: [a, b, c] as number[] };
    }
    return { winner: null as Mark, line: [] as number[] };
  }, [board]);

  const isTie = useMemo(() => board.every(v => v) && !winner, [board, winner]);

  useEffect(() => {
    if (winner) navigation.navigate('Result', { winner });
    else if (isTie) navigation.navigate('Result', { isTie: true });
  }, [winner, isTie, navigation]);

  const press = (idx: number) => {
    if (board[idx] || winner) return;
    const next = [...board];
    next[idx] = turn;
    setBoard(next);
  };

  const reset = () => setBoard(Array(9).fill(null));

  const canChooseFirst = board.every(v => v === null);
  const Seg = ({ mark }: { mark: 'X' | 'O' }) => {
    const active = first === mark;
    const color = mark === 'X' ? '#ef4444' : '#3b82f6';
    return (
      <TouchableOpacity
        onPress={() => canChooseFirst && setMyMark(mark)}
        style={[s.segBtn, active ? s.segActive : s.segInactive, !canChooseFirst && s.segDisabled]}
        activeOpacity={0.8}
      >
        <Ionicons name={mark === 'X' ? 'close' : 'ellipse-outline'} size={18} color={active ? '#fff' : color} />
      </TouchableOpacity>
    );
  };

  const renderCell = (idx: number) => {
    const value = board[idx];
    const inWin = line.includes(idx);
    const bg =
      winner === 'X' && inWin ? '#fee2e2' :
      winner === 'O' && inWin ? '#dbeafe' : '#ffffff';

    return (
      <TouchableOpacity key={idx} style={[s.cell, { backgroundColor: bg }]} onPress={() => press(idx)} activeOpacity={0.8}>
        {value === 'X' && <Ionicons name="close" size={52} color="#ef4444" />}
        {value === 'O' && <Ionicons name="ellipse-outline" size={52} color="#3b82f6" />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.wrap}>
      <Text style={s.title}>TicTac-GO!</Text>

      <View style={s.segment}>
        <Text style={s.label}>First turn</Text>
        <View style={s.segRow}>
          <Seg mark="X" />
          <Seg mark="O" />
        </View>
        {!canChooseFirst && <Text style={s.hint}>Reset to change first turn</Text>}
      </View>

      {!winner && !isTie && (
        <View style={s.turnRow}>
          <Text style={s.turnTxt}>Turn: </Text>
          <Ionicons name={turn === 'X' ? 'close' : 'ellipse-outline'} size={22} color={turn === 'X' ? '#ef4444' : '#3b82f6'} />
        </View>
      )}

      <View style={s.board}>
        {Array.from({ length: 9 }, (_, i) => renderCell(i))}
      </View>

      <View style={s.row}>
        <Button title="Reset" onPress={reset} />
        <View style={{ width: 12 }} />
        <Button title={user ? 'Stats' : 'Login'} onPress={() => navigation.navigate(user ? 'Stats' : 'Login')} />
        <View style={{ width: 12 }} />
        <Button title="About" onPress={() => navigation.navigate('About')} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#1e293b', marginBottom: 6 },
  segment: { alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 14, color: '#475569', marginBottom: 6 },
  hint: { fontSize: 12, color: '#64748b', marginTop: 6 },
  segRow: { flexDirection: 'row' },
  segBtn: { width: 80, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6, borderWidth: 1 },
  segActive: { backgroundColor: '#1e293b', borderColor: '#1e293b' },
  segInactive: { backgroundColor: '#fff', borderColor: '#94a3b8' },
  segDisabled: { opacity: 0.5 },
  turnRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  turnTxt: { fontSize: 16, color: '#334155' },
  board: { width: 312, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: 100, height: 100, margin: 2, borderRadius: 12, borderWidth: 2, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  row: { flexDirection: 'row', marginTop: 12 },
});
