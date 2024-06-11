import { PoolClient } from "pg";
import {
  commit,
  getTransaction,
  rollback,
  sqlExecMultipleRows,
} from "../utils/dbUtil";
import { logger } from "../utils/logger";
import { BigNumber } from "ethers";
import { isValidTimestamp } from "../utils/validator";

const successResponse = "success";

/**
 * create transfer
 * @returns { Promise<string> } transaction success
 */
export const createTransfer = async (
  from: string,
  to: string,
  value: BigNumber
): Promise<string> => {
  const createtableQuery =
    "CREATE TABLE IF NOT EXISTS transfers (id SERIAL PRIMARY KEY, sender VARCHAR(255), receiver VARCHAR(255), amount VARCHAR(255), timestamp TIMESTAMP WITH TIME ZONE);";
  const multiSql =
    "INSERT INTO transfers (sender, receiver, amount, timestamp) VALUES ($1, $2, $3, $4);";
  const multiData: string[][] = [
    [from, to, value.toString(), new Date().toISOString()],
  ];

  const client: PoolClient = await getTransaction();
  try {
    await client
      .query(createtableQuery)
      .then(() => logger.info("table created"))
      .catch((error: any) =>
        logger.error(`create Transfer error: ${error.message}`)
      );
    await sqlExecMultipleRows(client, multiSql, multiData);
    await commit(client);
    return successResponse;
  } catch (error: any) {
    await rollback(client);
    logger.error(`createTransfer error: ${error.message}`);
    throw new Error(error.message);
  }
};

/**
 * query total transfereed
 * @param {number} from - The start timestamp of period search.
 * @param {number} to - The end timestamp of period search.
 * @returns { Promise<string> } transaction success
 */
// Example implementation for readTransfers
export const readTotalVolume = async (): Promise<any[]> => {
  const querySql =
    "SELECT SUM(CAST(amount AS numeric)) AS total_amount FROM transfers;";
  const client: PoolClient = await getTransaction();
  try {
    const result = await client.query(querySql);
    await commit(client);
    return result.rows;
  } catch (error: any) {
    await rollback(client);
    logger.error(`readTransfers error: ${error.message}`);
    throw new Error(error.message);
  }
};

/**
 * Reads top accounts from the database
 * @param {string} from - The start timestamp of the period search
 * @param {string} to - The end timestamp of the period search
 * @param {string} sort - The field to order by
 * @param {string} direction - The order direction ('ASC' or 'DESC')
 * @param {number} limit - The maximum number of rows to return
 * @param {number} offset - The number of rows to skip before starting to return data
 * @returns {Promise<any[]>} - The list of transactions
 */

export const readTopAccounts = async (
  from: string,
  to: string,
  limit: number,
  offset: number
): Promise<any[]> => {
  if (from && !isValidTimestamp(from)) {
    throw new Error('Invalid "from" timestamp format.');
  }

  if (to && !isValidTimestamp(to)) {
    throw new Error('Invalid "to" timestamp format.');
  }

  // Default timestamps if not provided
  let defaultFrom = "2000-01-01 00:00:00";
  let defaultTo = new Date().toISOString();

  // Construct WHERE clauses based on optional parameters
  const whereClauses: string[] = [];

  if (from) defaultFrom = from;
  whereClauses.push(`timestamp >= '${defaultFrom}'`);

  if (to) defaultTo = to;
  whereClauses.push(`timestamp <= '${defaultTo}'`);

  // Combine WHERE clauses
  const whereClause =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // Build the query with optional filters
  let querySql = `
    SELECT address, SUM(CAST(amount AS numeric)) AS total_volume
    FROM (
      SELECT sender AS address, amount
      FROM transfers
      ${whereClause}
      UNION ALL
      SELECT receiver AS address, amount
      FROM transfers
      ${whereClause}
    ) AS combined_addresses
    GROUP BY address
    ORDER BY total_volume DESC
  `;

  // Apply limit and offset (optional)
  if (limit) {
    querySql += ` LIMIT ${limit}`;
  } 
  if (offset) {
    querySql += ` OFFSET ${offset}`;
  }

  const client: PoolClient = await getTransaction();
  try {
    const result = await client.query(querySql);
    await commit(client);
    return result.rows;
  } catch (error: any) {
    await rollback(client);
    logger.error(`readTopAccountsByVolume error: ${error.message}`);
    throw new Error(error.message);
  }
};

/**
 * Reads transfer transactions from the database
 * @param {string} from - The start timestamp of the period search
 * @param {string} to - The end timestamp of the period search
 * @param {string} sort - The field to order by
 * @param {string} direction - The order direction ('ASC' or 'DESC')
 * @param {number} limit - The maximum number of rows to return
 * @param {number} offset - The number of rows to skip before starting to return data
 * @returns {Promise<any[]>} - The list of transactions
 */
export const readTransfers = async (
  from: string,
  to: string,
  sort: string,
  direction: string,
  limit: number,
  offset: number
): Promise<any[]> => {
  let querySql = "SELECT * FROM transfers";

  // Validate optional parameters
  if (from && !isValidTimestamp(from)) {
    throw new Error('Invalid "from" timestamp format.');
  }

  if (to && !isValidTimestamp(to)) {
    throw new Error('Invalid "to" timestamp format.');
  }

  // Default timestamps if not provided
  let defaultFrom = "2000-01-01 00:00:00";
  let defaultTo = new Date().toISOString();

  // Construct WHERE clauses based on optional parameters
  const whereClauses: string[] = [];

  if (from) defaultFrom = from;
  whereClauses.push(`timestamp >= '${defaultFrom}'`);

  if (to) defaultTo = to;
  whereClauses.push(`timestamp <= '${defaultTo}'`);

  // Combine WHERE clauses
  const whereClause =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // Build the query with optional filters
  querySql += ` ${whereClause}`;

  // Order by specified field
  if (sort && ["receiver", "sender", "amount", "timestamp"].includes(sort)) {
    querySql += ` ORDER BY ${sort}`;

    // Apply sort direction (default ASC)
    direction = direction?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    querySql += ` ${direction}`;
  }

  // Apply limit and offset (optional)
  if (limit) {
    querySql += ` LIMIT ${limit}`;
  }
  if (offset) {
    querySql += ` OFFSET ${offset}`;
  }

  const client: PoolClient = await getTransaction();
  try {
    const result = await client.query(querySql);
    await commit(client);
    return result.rows;
  } catch (error: any) {
    await rollback(client);
    logger.error(`readTransfers error: ${error.message}`);
    throw new Error(error.message);
  }
};
