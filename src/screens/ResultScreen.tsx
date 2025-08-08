import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ route, navigation }: Props) {
  const { winner, isTie } = route.params ?? {};
  return (
    <View style={s.wrap}>
      <Text style={s.title}>Game Over</Text>
      <Text style={s.msg}>
        {winner ? `Player ${winner === 'X' ? '❌' : '⭕'} wins!` : "It's a tie!"}
      </Text>
      <View style={s.row}>
        <Button title="Play Again" onPress={() => navigation.reset({ index:0, routes:[{ name:'Game' }] })} />
        <View style={{ width: 12 }} />
        <Button title="About" onPress={() => navigation.navigate('About')} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#f1f5f9', padding:16 },
  title:{ fontSize:26, fontWeight:'800', color:'#1e293b', marginBottom:8 },
  msg:{ fontSize:18, fontWeight:'700', marginBottom:16 },
  row:{ flexDirection:'row' },
});
