// FIREBASE_COMM: Initialize Firebase with your config
import { initializeApp } from "firebase/app"
import { getFirestore, collection, query, where, getDocs, updateDoc, increment } from "firebase/firestore"

// DEV_BYPASS: Set this to true to bypass Firebase checks during development
export const DEV_BYPASS = true

// FIREBASE_COMM: Replace with your Firebase config from project settings
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

if (!DEV_BYPASS && firebaseConfig.apiKey) {
  try {
    // FIREBASE_COMM: Initialize Firebase app
    app = initializeApp(firebaseConfig)
    // FIREBASE_COMM: Initialize Firestore
    db = getFirestore(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

export { db }

// Helper functions for user data management
export async function incrementPlayCount(userEmail: string) {
  if (DEV_BYPASS || !db) return
  
  try {
    // Find user document by email and increment playCount
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
  if (DEV_BYPASS || !db) return null
  
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

export async function saveAcceptedCombo(userEmail: string, combo: any) {
  if (DEV_BYPASS || !db) return
  
  try {
    const q = query(collection(db, "participants"), where("email", "==", userEmail))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      await updateDoc(userDoc.ref, {
        acceptedCombo: combo,
        hasPlayed: true
      })
    }
  } catch (error) {
    console.error("Error saving accepted combo:", error)
  }
}
