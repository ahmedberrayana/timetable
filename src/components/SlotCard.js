import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, statusColor } from '../theme';
import { t } from '../i18n';

export default function SlotCard({ slot, onPress, onLongPress }) {
  const sc = statusColor(slot.status);
  const struck = slot.status === 'CANCELLED';
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} onLongPress={onLongPress}
      style={[styles.card, { borderLeftColor: sc }]}>
      <View style={styles.time}>
        <Text style={styles.t}>{slot.startTime}</Text>
        <Text style={styles.tEnd}>{slot.endTime}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, struck && styles.struck]}>{slot.courseTitle}</Text>
        <Text style={styles.meta}>{slot.type} · {slot.room}</Text>
        {slot.status !== 'NORMAL' && <Text style={[styles.badge, { color: sc }]}>{t(slot.status)}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 10, padding: 14,
    marginBottom: 10, borderLeftWidth: 5, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  time: { width: 62 },
  t: { fontSize: 16, fontWeight: '700', color: colors.ink },
  tEnd: { fontSize: 13, color: colors.muted },
  title: { fontSize: 16, fontWeight: '600', color: colors.ink },
  struck: { textDecorationLine: 'line-through', color: colors.muted },
  meta: { fontSize: 13, color: colors.muted, marginTop: 2 },
  badge: { fontSize: 13, fontWeight: '700', marginTop: 4 },
});
