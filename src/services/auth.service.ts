'use client';

import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile,
  User,
  getIdToken,
  signInAnonymously
} from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { Role, UserProfile } from '@/lib/types';

/**
 * Enterprise Authentication Service
 * Manages JWT-based authentication and user profile synchronization.
 */
export class AuthService {
  constructor(private auth: Auth, private db: Firestore) {}

  /**
   * Retrieves the current user's JWT ID Token.
   */
  async getJWTToken(user: User): Promise<string> {
    return await getIdToken(user);
  }

  /**
   * Synchronizes a Firebase User with a Firestore UserProfile document.
   */
  async syncProfile(user: User, additionalData: Partial<UserProfile> = {}): Promise<void> {
    const userRef = doc(this.db, 'users', user.uid);
    const snap = await getDoc(userRef);

    // Bootstrap Admin for specific authorized email
    const isAdminEmail = user.email?.toLowerCase() === 'kishorkakde026@gmail.com';
    const existingRole = snap.exists() ? (snap.data()?.role as Role) : null;
    const assignedRole: Role = existingRole || (isAdminEmail ? 'admin' : 'user');

    // For anonymous users, we use a clear identifier
    const defaultName = user.isAnonymous ? 'Eco Explorer' : 'Eco Warrior';
    const defaultEmail = user.isAnonymous ? 'Guest Account' : (user.email || '');

    const profile: any = {
      id: user.uid,
      email: defaultEmail,
      name: user.displayName || additionalData.name || defaultName,
      avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/150/150`,
      role: assignedRole,
      updatedAt: serverTimestamp(),
    };

    if (!snap.exists()) {
      profile.createdAt = serverTimestamp();
    }

    await setDoc(userRef, profile, { merge: true });
  }

  async loginWithEmail(email: string, pass: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, pass);
    await this.syncProfile(cred.user);
    return cred.user;
  }

  async signupWithEmail(email: string, pass: string, name: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    await this.syncProfile(cred.user, { name });
    return cred.user;
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.auth, provider);
    await this.syncProfile(cred.user);
    return cred.user;
  }

  async loginAnonymously() {
    try {
      const cred = await signInAnonymously(this.auth);
      await this.syncProfile(cred.user);
      return cred.user;
    } catch (error: any) {
      if (error.code === 'auth/configuration-not-found') {
        throw new Error("ACTION REQUIRED: Anonymous Sign-in is NOT enabled in your Firebase Console. Please go to Authentication -> Sign-in method and ENABLE it to access the portal as a guest.");
      }
      throw error;
    }
  }

  async logout() {
    await signOut(this.auth);
  }
}