import { collection, getDocs, onSnapshot, query, doc, getDoc, onSnapshot as onDocSnapshot } from 'firebase/firestore'
import { db } from './firebaseClient'

export async function getInitial<T>(path: string) {
  const q = query(collection(db, path))
  const snap = await getDocs(q)
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as T[]
}

export function subscribe<T>(path: string, cb: (docs: T[]) => void) {
  const q = query(collection(db, path))
  return onSnapshot(q, (snap: any) => {
    cb(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as T[])
  })
}

export async function getOne<T>(path: string, id: string) {
  const ref = doc(db, path, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as T
}

export function subscribeOne<T>(path: string, id: string, cb: (doc: T | null) => void) {
  const ref = doc(db, path, id)
  return onDocSnapshot(ref, (snap: any) => {
    if (!snap.exists()) return cb(null)
    cb({ id: snap.id, ...snap.data() } as T)
  })
}
