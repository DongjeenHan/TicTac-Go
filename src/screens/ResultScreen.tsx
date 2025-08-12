import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ route, navigation }: Props) {
  const { winner, isTie } = route.params ?? {};
  const { user, myMark, record } = useApp();

  const didCountRef = useRef(false);

  useEffect(() => {
    if (didCountRef.current) return;
    if (!user) return;
    if (winner) record(winner === myMark ? 'win' : 'loss');
    else if (isTie) record('tie');
    didCountRef.current = true;
  }, [winner, isTie, user, myMark]);

  const theme = winner === 'X' ? '#ef4444' : winner === 'O' ? '#3b82f6' : '#334155';
  const headline = winner ? `Player ${winner} wins!` : "It's a tie!";
  const scale = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 140 }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 850, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0, duration: 850, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ),
    ]).start();
  }, [scale, pulse]);

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });

  return (
    <View style={s.wrap}>
      <Animated.View style={[s.iconWrap, { transform: [{ scale }] }]}>
        <Ionicons name={winner === 'X' ? 'close' : winner === 'O' ? 'ellipse-outline' : 'scale'} size={64} color={theme} />
      </Animated.View>
      <Animated.Text style={[s.headline, { color: theme, transform: [{ scale: pulseScale }] }]}>{headline}</Animated.Text>
      <View style={s.row}>
        <Button title="Play Again" onPress={() => navigation.replace('Game')} />
        <View style={{ width: 12 }} />
        <Button
          title={user ? 'Stats' : 'Login'}
          onPress={() => navigation.navigate(user ? 'Stats' : 'Login')}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: 16 },
  iconWrap: { marginBottom: 12 },
  headline: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  row: { flexDirection: 'row' },
});
