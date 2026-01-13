// Mock Firestore implementation using localStorage
// This simulates Firestore behavior locally for development/demo purposes

export interface MockTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

const createTimestamp = (): MockTimestamp => {
  const now = Date.now();
  return {
    seconds: Math.floor(now / 1000),
    nanoseconds: (now % 1000) * 1000000,
    toDate: () => new Date(now)
  };
};

const STORAGE_PREFIX = 'mock_firestore_';

const getCollection = <T>(collectionName: string): Record<string, T> => {
  const data = localStorage.getItem(`${STORAGE_PREFIX}${collectionName}`);
  return data ? JSON.parse(data) : {};
};

const saveCollection = <T>(collectionName: string, data: Record<string, T>): void => {
  localStorage.setItem(`${STORAGE_PREFIX}${collectionName}`, JSON.stringify(data));
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock document reference
export interface MockDocumentReference {
  id: string;
  path: string;
}

// Mock Firestore functions
export const mockAddDoc = async <T extends Record<string, unknown>>(
  collectionName: string,
  data: T
): Promise<MockDocumentReference> => {
  const collection = getCollection<T & { createdAt: MockTimestamp; updatedAt: MockTimestamp }>(collectionName);
  const id = generateId();
  
  collection[id] = {
    ...data,
    createdAt: createTimestamp(),
    updatedAt: createTimestamp()
  };
  
  saveCollection(collectionName, collection);
  
  return { id, path: `${collectionName}/${id}` };
};

export const mockGetDoc = async <T>(
  collectionName: string,
  docId: string
): Promise<{ exists: boolean; data: T | null; id: string }> => {
  const collection = getCollection<T>(collectionName);
  const doc = collection[docId];
  
  return {
    exists: !!doc,
    data: doc || null,
    id: docId
  };
};

export const mockGetDocs = async <T>(
  collectionName: string,
  whereClause?: { field: string; value: unknown }
): Promise<Array<{ id: string; data: T }>> => {
  const collection = getCollection<T>(collectionName);
  
  let results = Object.entries(collection).map(([id, data]) => ({ id, data }));
  
  if (whereClause) {
    results = results.filter(({ data }) => {
      const fieldValue = (data as Record<string, unknown>)[whereClause.field];
      return fieldValue === whereClause.value;
    });
  }
  
  return results;
};

export const mockUpdateDoc = async <T extends Record<string, unknown>>(
  collectionName: string,
  docId: string,
  updates: Partial<T>
): Promise<void> => {
  const collection = getCollection<T & { updatedAt: MockTimestamp }>(collectionName);
  
  if (!collection[docId]) {
    throw new Error(`Document ${docId} not found`);
  }
  
  collection[docId] = {
    ...collection[docId],
    ...updates,
    updatedAt: createTimestamp()
  };
  
  saveCollection(collectionName, collection);
};

export const mockDeleteDoc = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  const collection = getCollection(collectionName);
  
  if (!collection[docId]) {
    throw new Error(`Document ${docId} not found`);
  }
  
  delete collection[docId];
  saveCollection(collectionName, collection);
};

// Utility to clear all mock data (for testing)
export const clearMockFirestore = (collectionName?: string): void => {
  if (collectionName) {
    localStorage.removeItem(`${STORAGE_PREFIX}${collectionName}`);
  } else {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};
