import React from 'react';
import { ActivityIndicator, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import StudentTimetableScreen from '../screens/StudentTimetableScreen';
import ProfessorsScreen from '../screens/ProfessorsScreen';
import ManualScreen from '../screens/ManualScreen';
import AdminSlotsScreen from '../screens/AdminSlotsScreen';
import AdminSlotFormScreen from '../screens/AdminSlotFormScreen';
import { t } from '../i18n';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StudentTabs() {
  const { logout } = useAuth();
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: colors.primary,
      headerRight: () => <Button title={t('logout')} onPress={logout} color={colors.muted} />,
    }}>
      <Tab.Screen name="Timetable" component={StudentTimetableScreen} options={{ title: t('timetable') }} />
      <Tab.Screen name="Professors" component={ProfessorsScreen} options={{ title: t('professors') }} />
      <Tab.Screen name="Manual" component={ManualScreen} options={{ title: t('manual') }} />
    </Tab.Navigator>
  );
}

function AdminStack() {
  const { logout } = useAuth();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Slots" component={AdminSlotsScreen}
        options={{ title: t('slots'), headerRight: () => <Button title={t('logout')} onPress={logout} /> }} />
      <Stack.Screen name="SlotForm" component={AdminSlotFormScreen} options={{ title: t('addSlot') }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { profile, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" /></View>;
  return (
    <NavigationContainer>
      {!profile ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : profile.role === 'ADMIN' ? <AdminStack /> : <StudentTabs />}
    </NavigationContainer>
  );
}
