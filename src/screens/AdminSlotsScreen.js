import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { subscribeToSlots, cancelSlot, deleteSlot } from '../services/timetableService';
import SlotCard from '../components/SlotCard';
import { colors } from '../theme';
import { t } from '../i18n';

export default function AdminSlotsScreen({ navigation }) {
  const [slots, setSlots] = useState([]);
  useEffect(() => subscribeToSlots(null, setSlots, console.warn), []);

  const actions = (slot) =>
    Alert.alert(slot.courseTitle, `${slot.dayOfWeek} ${slot.startTime}`, [
      { text: t('edit'), onPress: () => navigation.navigate('SlotForm', { slot }) },
      { text: t('cancel'), onPress: () => cancelSlot(slot) },
      { text: t('delete'), style: 'destructive', onPress: () =>
          Alert.alert(t('confirmDelete'), '', [
            { text: t('cancel'), style: 'cancel' },
            { text: t('delete'), style: 'destructive', onPress: () => deleteSlot(slot.id) },
          ]) },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList data={slots} keyExtractor={(s) => s.id} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <SlotCard slot={item} onPress={() => navigation.navigate('SlotForm', { slot: item })}
            onLongPress={() => actions(item)} />
        )} />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('SlotForm')}>
        <Text style={styles.fabTxt}>+ {t('addSlot')}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  fab: { position: 'absolute', right: 16, bottom: 20, backgroundColor: colors.primary, borderRadius: 28,
    paddingVertical: 14, paddingHorizontal: 20, elevation: 4 },
  fabTxt: { color: colors.onPrimary, fontWeight: '700' },
});
