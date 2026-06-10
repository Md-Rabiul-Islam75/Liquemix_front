/**
 * Firebase client (browser) — used only for the public Enquire → Google
 * sign-in flow. Config comes from NEXT_PUBLIC_FIREBASE_* env vars so no
 * secrets are committed. If those aren't set, `isFirebaseConfigured()`
 * returns false and the Enquire flow falls back to showing the contact
 * channels directly (so the site never breaks without Firebase).
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

function getFirebaseAuth(): Auth {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }
  const app: FirebaseApp = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);
  return getAuth(app);
}

export type GoogleIdentity = {
  idToken: string;
  name: string;
  email: string;
};

/**
 * Opens the Google sign-in popup and returns the Firebase ID token plus the
 * user's display name and email. The ID token is what the backend verifies.
 */
export async function signInWithGoogle(): Promise<GoogleIdentity> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return {
    idToken,
    name: result.user.displayName ?? "",
    email: result.user.email ?? "",
  };
}
