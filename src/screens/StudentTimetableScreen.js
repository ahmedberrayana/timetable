import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { subscribeToSlots, subscribeToNotifications } from '../services/timetableService';
import { showLocalAlert } from '../notifications';
import SlotCard from '../components/SlotCard';
import { colors, DAYS } from '../theme';
import { t } from '../i18n';

export default function StudentTimetableScreen() {
  const { profile } = useAuth();
  const [slots, setSlots] = useState([]);
  const [day, setDay] = useState(DAYS[Math.min(Math.max(new Date().getDay() - 1, 0), 5)]);
  const [refreshing, setRefreshing] = useState(false);
  const [tick, setTick] = useState(0);

  // Live slots for this student's group (re-subscribes on pull-to-refresh)
  useEffect(() => subscribeToSlots(profile.groupId, setSlots, console.warn), [profile.groupId, tick]);

  // Real-time alerts from notificationLogs created after the app opened
  useEffect(() => {
    const startedAt = Date.now();
    return subscribeToNotifications(profile.groupId, (n) => {
      if (n.createdAt >= startedAt - 2000) showLocalAlert(n);
    });
  }, [profile.groupId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true); setTick((x) => x + 1); setTimeout(() => setRefreshing(false), 600);
  }, []);

  const data = useMemo(
    () => slots.filter((s) => s.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [slots, day]);

  return (
    <View style={styles.wrap}>
      <View style={styles.days}>
        {DAYS.map((d) => (
          <TouchableOpacity key={d} onPress={() => setDay(d)} style={[styles.day, d === day && styles.dayOn]}>
            <Text style={[styles.dayTxt, d === day && styles.dayTxtOn]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={data} keyExtractor={(i) => i.id} contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => <SlotCard slot={item} />}
        ListEmptyComponent={<Text style={styles.empty}>{t('noClasses')}</Text>} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  days: { flexDirection: 'row', padding: 10, backgroundColor: colors.surface },
  day: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  dayOn: { backgroundColor: colors.ink },
  dayTxt: { color: colors.muted, fontWeight: '600' },
  dayTxtOn: { color: '#fff' },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
});
