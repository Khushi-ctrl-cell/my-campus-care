// Firestore User Service (Mock Implementation)
// Uses localStorage to simulate Firestore behavior
// Replace with real Firestore when you have Firebase credentials

import { 
  mockAddDoc, 
  mockGetDoc, 
  mockGetDocs, 
  mockUpdateDoc, 
  mockDeleteDoc,
  MockDocumentReference,
  MockTimestamp
} from './mockFirestore';

// User interface matching the required fields
export interface FirestoreUser {
  id?: string;
  name: string;
  email: string;
  age: number;
  createdAt?: MockTimestamp;
  updatedAt?: MockTimestamp;
}

// Collection name
const USERS_COLLECTION = 'users';

/**
 * Create a new user document
 * @param userData - User data to insert
 * @returns The created document reference
 */
export const createUser = async (
  userData: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MockDocumentReference> => {
  try {
    const docRef = await mockAddDoc(USERS_COLLECTION, userData);
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
    const result = await mockGetDoc<FirestoreUser>(USERS_COLLECTION, userId);
    
    if (result.exists && result.data) {
      return { id: result.id, ...result.data };
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
    const results = await mockGetDocs<FirestoreUser>(USERS_COLLECTION, { field: 'email', value: email });
    
    if (results.length > 0) {
      return { id: results[0].id, ...results[0].data };
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
    const results = await mockGetDocs<FirestoreUser>(USERS_COLLECTION);
    return results.map(({ id, data }) => ({ id, ...data }));
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
    await mockUpdateDoc(USERS_COLLECTION, userId, updates);
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
    await mockDeleteDoc(USERS_COLLECTION, userId);
    console.log('User deleted:', userId);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
