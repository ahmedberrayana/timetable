import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import { t } from '../i18n';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true); setError('');
    try { await login(email.trim(), password); }
    catch (e) {
      console.log('AUTH/LOGIN ERROR:', e.code, e.message);
      setError(e.message === 'NO_PROFILE' ? t('noProfile') : `${t('loginError')} (${e.code || e.message})`);
    }
    finally { setBusy(false); }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>{t('timetable')}</Text>
      <TextInput style={styles.input} placeholder={t('email')} autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder={t('password')} secureTextEntry
        value={password} onChangeText={setPassword} />
      {!!error && <Text style={styles.err}>{error}</Text>}
      <TouchableOpacity style={styles.btn} onPress={submit} disabled={busy}>
        {busy ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={styles.btnTxt}>{t('login')}</Text>}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 28, backgroundColor: colors.bg },
  h1: { fontSize: 32, fontWeight: '800', color: colors.ink, marginBottom: 28 },
  input: { backgroundColor: colors.surface, borderRadius: 10, padding: 14, marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, fontSize: 16 },
  err: { color: colors.cancelled, marginBottom: 10 },
  btn: { backgroundColor: colors.primary, borderRadius: 10, padding: 15, alignItems: 'center' },
  btnTxt: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
});
