import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

export default function GameScreen({ navigation }: Props) {
  const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
  const [player, setPlayer] = useState<'X' | 'O'>('X');

  const winner = useMemo<'X' | 'O' | null>(() => {
    for (const [a,b,c] of LINES) {
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

  return (
    <View style={s.wrap}>
      <Text style={s.title}>TicTac-GO!</Text>
      <Text style={s.turn}>It's Player {player === 'X' ? '❌' : '⭕'}'s turn!</Text>

      <View style={s.board}>
        {board.map((v, i) => (
          <TouchableOpacity key={i} style={s.cell} onPress={() => tap(i)}>
            <Text style={[s.cellTxt, v==='X'?s.x:s.o]}>{v ?? ''}</Text>
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
  wrap:{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#f1f5f9', padding:16 },
  title:{ fontSize:28, fontWeight:'800', color:'#1e293b', marginBottom:8 },
  turn:{ fontSize:16, color:'#334155', marginBottom:12 },
  board:{ width:312, flexDirection:'row', flexWrap:'wrap' },
  cell:{ width:100, height:100, borderWidth:2, borderColor:'#1e293b', alignItems:'center', justifyContent:'center', backgroundColor:'#fff', margin:2, borderRadius:12 },
  cellTxt:{ fontSize:42, fontWeight:'800' },
  x:{ color:'#ef4444' }, o:{ color:'#3b82f6' },
  row:{ flexDirection:'row', marginTop:12 },
});
