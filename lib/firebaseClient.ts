import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG 
  ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) 
  : {
      apiKey: "AIzaSyA5qGJyTIG8lCok67wG1r6QwhPxQFBG25Q",
      authDomain: "my-students-mirror.firebaseapp.com",
      projectId: "my-students-mirror",
      storageBucket: "my-students-mirror.firebasestorage.app",
      messagingSenderId: "852857889242",
      appId: "1:852857889242:web:d691f5c3a13b62366fa0e3",
      measurementId: "G-6J2JQRG0L9"
    }

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const db = getFirestore(app)
