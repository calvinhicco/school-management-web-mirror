import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = typeof window !== 'undefined' ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}') : {}

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const db = getFirestore(app)
