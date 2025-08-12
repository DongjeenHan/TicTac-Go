import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

export default function AboutScreen(_props: Props) {
  return (
    <View style={s.wrap}>
      <Text style={s.title}>About TicTac-GO!</Text>
      <Text style={s.text}>A modern Tic Tac Toe game developed by Team TriUnity.</Text>
      <Text style={s.sub}>Team Members</Text>
      <Text style={s.text}>Madara, Mark — [000894819]</Text>
      <Text style={s.text}>Han, Dongjeen — [000938391]</Text>
      <Text style={s.text}>Harika, Gurman — [000946804]</Text>
      <Text style={s.date}>July 2025</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#fff', padding:24 },
  title:{ fontSize:24, fontWeight:'800', color:'#1e293b', marginBottom:8 },
  sub:{ fontSize:18, fontWeight:'700', marginTop:16, marginBottom:6 },
  text:{ fontSize:16, color:'#334155' },
  date:{ marginTop:16, fontStyle:'italic', color:'#64748b' },
});
