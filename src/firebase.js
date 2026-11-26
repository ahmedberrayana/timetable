import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAPMZgW3rw6yc5YXKWLOeIJ_xXUSFwNVPw",
  authDomain: "timetable-3321b.firebaseapp.com",
  projectId: "timetable-3321b",
  storageBucket: "timetable-3321b.firebasestorage.app",
  messagingSenderId: "411499348085",
  appId: "1:411499348085:web:c20157c3dceab8ba96f83c",
  measurementId: "G-BEL2R7JE9Y"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);