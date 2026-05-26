import { initializeApp } from "firebase/app"
import { getFirestore, collection, query, where, getDocs, updateDoc, increment } from "firebase/firestore"
import type { Challenge } from "@/lib/challenge-data"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: any = null
let db: any = null

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

export { db }

export async function incrementPlayCount(userEmail: string) {
  if (!db) return
  
  try {
    const q = query(collection(db, "participants"), where("email", "==", userEmail))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      await updateDoc(userDoc.ref, {
        playCount: increment(1)
      })
    }
  } catch (error) {
    console.error("Error incrementing play count:", error)
  }
}

export async function getUserData(userEmail: string) {
  if (!db) return null
  
  try {
    const q = query(collection(db, "participants"), where("email", "==", userEmail))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data()
    }
    return null
  } catch (error) {
    console.error("Error getting user data:", error)
    return null
  }
}

export async function saveAcceptedCombo(userEmail: string, combo: Challenge) {
  if (!db) return
  
  try {
    const q = query(collection(db, "participants"), where("email", "==", userEmail))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      await updateDoc(userDoc.ref, {
        acceptedCombo: combo,
        language: combo.language,
        hasPlayed: true
      })
    }
  } catch (error) {
    console.error("Error saving accepted combo:", error)
  }
}
