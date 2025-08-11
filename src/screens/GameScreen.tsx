import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export default function GameScreen({ navigation }: Props) {
  const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
  const [player, setPlayer] = useState<'X' | 'O'>('X');

  const winner = useMemo<'X' | 'O' | null>(() => {
    for (const [a, b, c] of LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return null;
  }, [board]);

  const isTie = useMemo(() => !winner && board.every(Boolean), [winner, board]);

  useEffect(() => {
    if (winner) navigation.replace('Result', { winner });
    else if (isTie) navigation.replace('Result', { isTie: true });
  }, [winner, isTie, navigation]);

  const tap = (i: number) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = player;
    setBoard(next);
    setPlayer(player === 'X' ? 'O' : 'X');
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setPlayer('X');
  };

  const renderIcon = (value: 'X' | 'O' | null) => {
    if (value === 'X') {
      return <Ionicons name="close" size={56} color="#ef4444" />;
    }
    if (value === 'O') {
      return <Ionicons name="ellipse-outline" size={52} color="#3b82f6" />;
    }
    return null;
  };

  return (
    <View style={s.wrap}>
      <Text style={s.title}>TicTac-GO!</Text>

      <View style={s.turnRow}>
        <Text style={s.turnTxt}>It's Player </Text>
        <Ionicons
          name={player === 'X' ? 'close' : 'ellipse-outline'}
          size={22}
          color={player === 'X' ? '#ef4444' : '#3b82f6'}
        />
        <Text style={s.turnTxt}>’s turn!</Text>
      </View>

      <View style={s.board}>
        {board.map((v, i) => (
          <TouchableOpacity key={i} style={s.cell} onPress={() => tap(i)}>
            {renderIcon(v)}
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.row}>
        <Button title="Reset" onPress={reset} />
        <View style={{ width: 12 }} />
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
        <View style={{ width: 12 }} />
        <Button title="About" onPress={() => navigation.navigate('About')} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  turnRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  turnTxt: { fontSize: 16, color: '#334155' },
  board: { width: 312, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: 100, height: 100, borderWidth: 2, borderColor: '#1e293b', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', margin: 2, borderRadius: 12 },
  row: { flexDirection: 'row', marginTop: 12 },
});
