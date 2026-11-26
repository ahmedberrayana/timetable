import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import { colors } from '../theme';
import { t } from '../i18n';

// Put your PDF at assets/manual/user_manual.pdf (metro.config.js already allows .pdf)
export default function ManualScreen() {
  const open = async () => {
    try {
      const [asset] = await Asset.loadAsync(require('../../assets/manual/user_manual.pdf'));
      await Sharing.shareAsync(asset.localUri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
    } catch (e) { Alert.alert(t('manual'), String(e.message)); }
  };
  return (
    <View style={styles.wrap}>
      <Text style={styles.h}>{t('manual')}</Text>
      <TouchableOpacity style={styles.btn} onPress={open}>
        <Text style={styles.btnTxt}>{t('openManual')}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  h: { fontSize: 22, fontWeight: '800', color: colors.ink, marginBottom: 20 },
  btn: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 24 },
  btnTxt: { color: colors.onPrimary, fontWeight: '700', fontSize: 16 },
});
