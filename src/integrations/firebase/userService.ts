// Firestore User Service
// Handles CRUD operations for the 'users' collection

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  Timestamp,
  DocumentReference,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from './config';

// User interface matching the required fields
export interface FirestoreUser {
  id?: string;
  name: string;
  email: string;
  age: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Collection reference
const USERS_COLLECTION = 'users';
const usersCollection = collection(db, USERS_COLLECTION);

/**
 * Create a new user document in Firestore
 * @param userData - User data to insert
 * @returns The created document reference
 */
export const createUser = async (userData: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<DocumentReference> => {
  try {
    const docRef = await addDoc(usersCollection, {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('User created with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a user by document ID
 * @param userId - The document ID
 * @returns The user data or null if not found
 */
export const getUserById = async (userId: string): Promise<FirestoreUser | null> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FirestoreUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a user by email
 * @param email - The user's email
 * @returns The user data or null if not found
 */
export const getUserByEmail = async (email: string): Promise<FirestoreUser | null> => {
  try {
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as FirestoreUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw new Error(`Failed to get user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get all users
 * @returns Array of all users
 */
export const getAllUsers = async (): Promise<FirestoreUser[]> => {
  try {
    const querySnapshot: QuerySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreUser[];
  } catch (error) {
    console.error('Error getting all users:', error);
    throw new Error(`Failed to get users: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update a user document
 * @param userId - The document ID
 * @param updates - Partial user data to update
 */
export const updateUser = async (
  userId: string, 
  updates: Partial<Omit<FirestoreUser, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    console.log('User updated:', userId);
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a user document
 * @param userId - The document ID to delete
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(docRef);
    console.log('User deleted:', userId);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
