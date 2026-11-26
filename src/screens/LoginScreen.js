
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';

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
    if (!email.trim() || !password) {
      setError(t('fillAll'));
      return;
    }

    setBusy(true);
    setError('');

    try {
      await login(email.trim(), password);
    } catch (e) {
      console.log('AUTH/LOGIN ERROR:', e.code, e.message);

      if (e.message === 'NO_PROFILE') {
        setError(t('noProfile'));
      } else {
        setError(`${t('loginError')} (${e.code || e.message})`);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      {/* Application logo */}
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Application title */}
      <Text style={styles.h1}>
        {t('timetable')}
      </Text>

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder={t('email')}
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!busy}
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder={t('password')}
        placeholderTextColor={colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!busy}
      />

      {/* Error message */}
      {!!error && (
        <Text style={styles.err}>
          {error}
        </Text>
      )}

      {/* Login button */}
      <TouchableOpacity
        style={[styles.btn, busy && styles.btnDisabled]}
        onPress={submit}
        disabled={busy}
        activeOpacity={0.8}
      >
        {busy ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={styles.btnTxt}>
            {t('login')}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
    backgroundColor: colors.bg,
  },

  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },

  h1: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 28,
    textAlign: 'center',
  },

  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    fontSize: 16,
    color: colors.ink,
  },

  err: {
    color: colors.cancelled,
    marginBottom: 10,
    fontSize: 14,
  },

  btn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },

  btnDisabled: {
    opacity: 0.7,
  },

  btnTxt: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
