// Repository/service layer: the ONLY place that talks to Firestore.
// Collections: users, groups, courses, scheduleSlots, notificationLogs
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, where,
} from 'firebase/firestore';
import { db } from '../firebase';

const withId = (d) => ({ id: d.id, ...d.data() });

// ---- Users ----
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { userId: uid, ...snap.data() } : null;
}

// ---- Groups & Courses ----
export async function getGroups() {
  return (await getDocs(collection(db, 'groups'))).docs.map(withId);
}
export async function getCourses() {
  return (await getDocs(collection(db, 'courses'))).docs.map(withId);
}

// ---- Schedule slots ----
export function subscribeToSlots(groupId, onData, onError) {
  const q = groupId
    ? query(collection(db, 'scheduleSlots'), where('groupId', '==', groupId))
    : collection(db, 'scheduleSlots'); // admin sees all
  return onSnapshot(q, (s) => onData(s.docs.map(withId)), onError);
}

export async function createSlot(slot) {
  const ref = await addDoc(collection(db, 'scheduleSlots'), { ...slot, status: 'NORMAL' });
  await logNotification({ ...slot, id: ref.id }, 'NEW');
  return ref.id;
}

export async function updateSlot(id, changes, notifyType = 'RESCHEDULED') {
  await updateDoc(doc(db, 'scheduleSlots', id), changes);
  const snap = await getDoc(doc(db, 'scheduleSlots', id));
  await logNotification({ id, ...snap.data() }, notifyType);
}

export async function cancelSlot(slot) {
  await updateSlot(slot.id, { status: 'CANCELLED' }, 'CANCELLED');
}

export async function deleteSlot(id) {
  await deleteDoc(doc(db, 'scheduleSlots', id));
}

// ---- Notification log (also drives real-time alerts on every client) ----
async function logNotification(slot, type) {
  const titles = { NEW: 'New class scheduled', RESCHEDULED: 'Class rescheduled', CANCELLED: 'Class cancelled' };
  await addDoc(collection(db, 'notificationLogs'), {
    targetGroupId: slot.groupId,
    slotId: slot.id,
    title: titles[type],
    message: `${slot.courseCode || ''} ${slot.type} · ${slot.dayOfWeek} ${slot.startTime}-${slot.endTime} · ${slot.room}`.trim(),
    createdAt: Date.now(),
  });
}

export function subscribeToNotifications(groupId, onNew) {
  const q = query(collection(db, 'notificationLogs'), where('targetGroupId', '==', groupId));
  return onSnapshot(q, (s) =>
    s.docChanges().forEach((c) => c.type === 'added' && onNew(withId(c.doc)))
  );
}
