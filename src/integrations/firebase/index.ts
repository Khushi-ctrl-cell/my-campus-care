// Firebase exports
export { db } from './config';
export { 
  createUser, 
  getUserById, 
  getUserByEmail,
  getAllUsers, 
  updateUser, 
  deleteUser,
  type FirestoreUser 
} from './userService';
