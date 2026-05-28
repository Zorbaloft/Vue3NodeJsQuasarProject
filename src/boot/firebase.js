import { initializeApp } from 'firebase/app'
import { getAuth,connectAuthEmulator } from 'firebase/auth'
import { getFirestore,connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBlJs0ON0yvGHWVgh4JFgRrW7T92kxOrEE',
  authDomain: 'postballs.firebaseapp.com',
  projectId: 'postballs',
  storageBucket: 'postballs.firebasestorage.app',
  messagingSenderId: '400372647216',
  appId: '1:400372647216:web:bc23ba5356e2bab76574f5',
}

const app = initializeApp(firebaseConfig)


const auth = getAuth(app)
connectAuthEmulator(auth, 'http://127.0.0.1:9099')

const db = getFirestore(app)
connectFirestoreEmulator(db, '127.0.0.1', 8080)



export { app, auth, db }
