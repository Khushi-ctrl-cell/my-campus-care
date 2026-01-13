// Firebase exports (Mock Implementation)
// To switch to real Firestore, update config.ts with your Firebase credentials
// and update userService.ts to use real Firestore functions

export { 
  createUser, 
  getUserById, 
  getUserByEmail,
  getAllUsers, 
  updateUser, 
  deleteUser,
  type FirestoreUser 
} from './userService';

export { clearMockFirestore } from './mockFirestore';
