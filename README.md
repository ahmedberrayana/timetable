# Timetable – React Native (Expo)
1. `npm install`
2. Paste Firebase web config in `src/firebase.js`
3. Add `assets/manual/user_manual.pdf` and `assets/alert_tone.mp3`
4. Deploy `firestore.rules`; seed `groups`, `courses`, and `users/{authUid}` docs (role, groupId, fullName...)
5. `npx expo start`  (notification sound/channel need a dev build: `npx expo run:android`)
