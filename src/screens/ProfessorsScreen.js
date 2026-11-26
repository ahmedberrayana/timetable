import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { getCourses } from '../services/timetableService';
import { colors } from '../theme';
import { t } from '../i18n';

export default function ProfessorsScreen() {
  const [courses, setCourses] = useState([]);
  useEffect(() => { getCourses().then(setCourses); }, []);
  return (
    <FlatList style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}
      data={courses} keyExtractor={(c) => c.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.professorName}</Text>
          <Text style={styles.sub}>{item.code} · {item.title}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={() => Linking.openURL(`tel:${item.professorPhone}`)}>
              <Text style={styles.btnTxt}>{t('call')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => Linking.openURL(`mailto:${item.professorEmail}`)}>
              <Text style={styles.btnTxt}>{t('emailProf')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} />
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 10, padding: 14, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '700', color: colors.ink },
  sub: { color: colors.muted, marginTop: 2 },
  row: { flexDirection: 'row', marginTop: 12 },
  btn: { borderWidth: 1, borderColor: colors.primary, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, marginRight: 10 },
  btnTxt: { color: colors.primary, fontWeight: '700' },
});
