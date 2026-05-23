import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

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
const db = getFirestore(app)

export { app, auth, db }
