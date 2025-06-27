import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD281GSe9a6mvG2g8QctXAtZJB7Y4YXFEA",
  authDomain: "my-point-de-vente-v21.firebaseapp.com",
  projectId: "my-point-de-vente-v21",
  storageBucket: "my-point-de-vente-v21.firebasestorage.app",
  messagingSenderId: "505303472400",
  appId: "1:505303472400:web:2c1bff06db03b95f746d95",
  measurementId: "G-34V6944TPN"
};

// Initialize Firebase, but only if it hasn't been initialized yet.
// This prevents errors during development with hot-reloading.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Export the services and the firebase object itself for things like Timestamp
export { auth, db, firebase };
