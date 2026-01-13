// Mock BigQuery implementation using localStorage
// This simulates BigQuery behavior locally for development/demo purposes

const STORAGE_PREFIX = 'mock_bigquery_';

export interface BigQueryRow {
  [key: string]: string | number | boolean | null;
}

export interface BigQueryTable {
  rows: BigQueryRow[];
  schema: { name: string; type: string }[];
}

const getDataset = (datasetId: string): Record<string, BigQueryTable> => {
  const data = localStorage.getItem(`${STORAGE_PREFIX}${datasetId}`);
  return data ? JSON.parse(data) : {};
};

const saveDataset = (datasetId: string, data: Record<string, BigQueryTable>): void => {
  localStorage.setItem(`${STORAGE_PREFIX}${datasetId}`, JSON.stringify(data));
};

/**
 * Create a dataset
 */
export const createDataset = async (datasetId: string): Promise<void> => {
  if (!localStorage.getItem(`${STORAGE_PREFIX}${datasetId}`)) {
    saveDataset(datasetId, {});
  }
  console.log(`Dataset ${datasetId} created`);
};

/**
 * Create a table in a dataset
 */
export const createTable = async (
  datasetId: string,
  tableId: string,
  schema: { name: string; type: string }[]
): Promise<void> => {
  const dataset = getDataset(datasetId);
  dataset[tableId] = { rows: [], schema };
  saveDataset(datasetId, dataset);
  console.log(`Table ${tableId} created in dataset ${datasetId}`);
};

/**
 * Insert rows into a table
 */
export const insertRows = async (
  datasetId: string,
  tableId: string,
  rows: BigQueryRow[]
): Promise<{ insertedCount: number }> => {
  const dataset = getDataset(datasetId);
  
  if (!dataset[tableId]) {
    throw new Error(`Table ${tableId} not found in dataset ${datasetId}`);
  }
  
  // Add timestamp to each row
  const timestampedRows = rows.map(row => ({
    ...row,
    _inserted_at: new Date().toISOString()
  }));
  
  dataset[tableId].rows.push(...timestampedRows);
  saveDataset(datasetId, dataset);
  
  console.log(`Inserted ${rows.length} rows into ${datasetId}.${tableId}`);
  return { insertedCount: rows.length };
};

/**
 * Query a table (simplified SQL-like query)
 */
export const queryTable = async (
  datasetId: string,
  tableId: string,
  options?: {
    where?: { field: string; operator: '=' | '>' | '<' | '>=' | '<='; value: unknown };
    limit?: number;
    orderBy?: { field: string; direction: 'ASC' | 'DESC' };
  }
): Promise<BigQueryRow[]> => {
  const dataset = getDataset(datasetId);
  
  if (!dataset[tableId]) {
    throw new Error(`Table ${tableId} not found in dataset ${datasetId}`);
  }
  
  let results = [...dataset[tableId].rows];
  
  // Apply WHERE clause
  if (options?.where) {
    const { field, operator, value } = options.where;
    results = results.filter(row => {
      const rowValue = row[field];
      switch (operator) {
        case '=': return rowValue === value;
        case '>': return (rowValue as number) > (value as number);
        case '<': return (rowValue as number) < (value as number);
        case '>=': return (rowValue as number) >= (value as number);
        case '<=': return (rowValue as number) <= (value as number);
        default: return true;
      }
    });
  }
  
  // Apply ORDER BY
  if (options?.orderBy) {
    const { field, direction } = options.orderBy;
    results.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal === bVal) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      const comparison = aVal < bVal ? -1 : 1;
      return direction === 'DESC' ? -comparison : comparison;
    });
  }
  
  // Apply LIMIT
  if (options?.limit) {
    results = results.slice(0, options.limit);
  }
  
  return results;
};

/**
 * Get table schema
 */
export const getTableSchema = async (
  datasetId: string,
  tableId: string
): Promise<{ name: string; type: string }[]> => {
  const dataset = getDataset(datasetId);
  
  if (!dataset[tableId]) {
    throw new Error(`Table ${tableId} not found in dataset ${datasetId}`);
  }
  
  return dataset[tableId].schema;
};

/**
 * Delete all rows from a table
 */
export const truncateTable = async (
  datasetId: string,
  tableId: string
): Promise<void> => {
  const dataset = getDataset(datasetId);
  
  if (!dataset[tableId]) {
    throw new Error(`Table ${tableId} not found in dataset ${datasetId}`);
  }
  
  dataset[tableId].rows = [];
  saveDataset(datasetId, dataset);
  console.log(`Table ${tableId} truncated`);
};

/**
 * List all tables in a dataset
 */
export const listTables = async (datasetId: string): Promise<string[]> => {
  const dataset = getDataset(datasetId);
  return Object.keys(dataset);
};

/**
 * Clear all mock BigQuery data
 */
export const clearMockBigQuery = (datasetId?: string): void => {
  if (datasetId) {
    localStorage.removeItem(`${STORAGE_PREFIX}${datasetId}`);
  } else {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};
