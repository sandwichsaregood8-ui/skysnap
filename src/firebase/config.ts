// This file configures and initializes the Firebase app instance.

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration.
// This is a public configuration and is safe to be exposed on the client-side.
// Security is enforced by Firebase Security Rules.
const firebaseConfig = {
  apiKey: "AIzaSyDe_q2mFFSj7PUna_aO3kX1ggd37JM0XV0",
  authDomain: "studio-9800012816-46bdf.firebaseapp.com",
  projectId: "studio-9800012816-46bdf",
  storageBucket: "studio-9800012816-46bdf.appspot.com",
  messagingSenderId: "1044980903448",
  appId: "1:1044980903448:web:eefb90382bc6390026dd6d"
};

// Initialize Firebase App.
// This pattern prevents re-initializing the app on hot reloads in development.
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Get instances of the auth and firestore services for use throughout the app.
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the main app instance as default.
export default app;
