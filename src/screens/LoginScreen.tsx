import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();

  const submit = async () => {
    if (!email || !password) return Alert.alert('Login', 'Please enter email & password.');
    await login(email);
    navigation.reset({ index: 0, routes: [{ name: 'Game' }] });
  };

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Login to TicTac-GO!</Text>
      <TextInput
        style={s.inp}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={s.inp}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Login" onPress={submit} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  inp: { width: '80%', height: 44, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#94a3b8', paddingHorizontal: 12, marginBottom: 10 },
});
