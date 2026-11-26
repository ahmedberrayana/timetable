import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { getGroups, getCourses, createSlot, updateSlot } from '../services/timetableService';
import { colors, DAYS } from '../theme';
import { t } from '../i18n';

const TYPES = ['LECTURE', 'TD', 'TP'];
const STATUSES = ['NORMAL', 'RESCHEDULED', 'CANCELLED'];

function Chips({ options, value, onChange, label = (o) => o }) {
  return (
    <View style={styles.chips}>
      {options.map((o) => {
        const key = typeof o === 'string' ? o : o.id;
        const on = key === value;
        return (
          <TouchableOpacity key={key} onPress={() => onChange(key)} style={[styles.chip, on && styles.chipOn]}>
            <Text style={[styles.chipTxt, on && { color: '#fff' }]}>{label(o)}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AdminSlotFormScreen({ route, navigation }) {
  const editing = route.params?.slot;
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [f, setF] = useState(editing ?? {
    groupId: '', courseId: '', dayOfWeek: 'MON', startTime: '', endTime: '', room: '', type: 'LECTURE', status: 'NORMAL',
  });
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => { getGroups().then(setGroups); getCourses().then(setCourses); }, []);

  const save = async () => {
    if (!f.groupId || !f.courseId || !f.startTime || !f.endTime || !f.room) return Alert.alert(t('fillAll'));
    const course = courses.find((c) => c.id === f.courseId);
    const payload = {
      groupId: f.groupId, courseId: f.courseId, courseTitle: course.title, courseCode: course.code,
      dayOfWeek: f.dayOfWeek, startTime: f.startTime, endTime: f.endTime, room: f.room, type: f.type,
    };
    try {
      if (editing) await updateSlot(editing.id, { ...payload, status: f.status },
        f.status === 'CANCELLED' ? 'CANCELLED' : 'RESCHEDULED');
      else await createSlot(payload);
      navigation.goBack();
    } catch (e) { Alert.alert(String(e.message)); }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.l}>{t('group')}</Text>
      <Chips options={groups} value={f.groupId} onChange={set('groupId')} label={(g) => g.name} />
      <Text style={styles.l}>{t('course')}</Text>
      <Chips options={courses} value={f.courseId} onChange={set('courseId')} label={(c) => c.code} />
      <Text style={styles.l}>{t('day')}</Text>
      <Chips options={DAYS} value={f.dayOfWeek} onChange={set('dayOfWeek')} />
      <Text style={styles.l}>{t('type')}</Text>
      <Chips options={TYPES} value={f.type} onChange={set('type')} />
      <Text style={styles.l}>{t('start')}</Text>
      <TextInput style={styles.in} value={f.startTime} onChangeText={set('startTime')} placeholder="08:30" />
      <Text style={styles.l}>{t('end')}</Text>
      <TextInput style={styles.in} value={f.endTime} onChangeText={set('endTime')} placeholder="10:00" />
      <Text style={styles.l}>{t('room')}</Text>
      <TextInput style={styles.in} value={f.room} onChangeText={set('room')} placeholder="B204" />
      {editing && (<><Text style={styles.l}>{t('status')}</Text>
        <Chips options={STATUSES} value={f.status} onChange={set('status')} label={(s) => t(s)} /></>)}
      <TouchableOpacity style={styles.btn} onPress={save}><Text style={styles.btnTxt}>{t('saveSlot')}</Text></TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  l: { fontWeight: '700', color: colors.ink, marginTop: 14, marginBottom: 6 },
  in: { backgroundColor: colors.surface, borderRadius: 10, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: 18, paddingVertical: 7, paddingHorizontal: 14, marginRight: 8, marginBottom: 8 },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { color: colors.ink },
  btn: { backgroundColor: colors.primary, borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 24 },
  btnTxt: { color: colors.onPrimary, fontWeight: '700', fontSize: 16 },
});
